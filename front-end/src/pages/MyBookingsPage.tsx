import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Container
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Room as RoomIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import NavBar from "../components/NavBar";
import { roomService } from "../services/roomService";
import { authService } from "../services/authService";
import type { Reservation } from "../services/roomService";

function MyBookingsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = authService.getStoredUser();
      if (!user?.email) {
        setError('Kullanıcı bilgileri bulunamadı. Lütfen giriş yapın.');
        return;
      }

      const data = await roomService.getUserReservations(user.email);
      setReservations(data);
    } catch (err: any) {
      console.error('Rezervasyonlar yüklenirken hata:', err);
      setError(err.response?.data?.message || 'Rezervasyonlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    try {
      setCancelling(true);
      await roomService.cancelReservation(selectedReservation.id);
      setSuccess('Rezervasyon başarıyla iptal edildi');
      setCancelDialogOpen(false);
      setSelectedReservation(null);
      // Rezervasyon listesini yenile
      loadReservations();
    } catch (err: any) {
      console.error('Rezervasyon iptal edilirken hata:', err);
      setError(err.response?.data?.message || 'Rezervasyon iptal edilirken bir hata oluştu');
    } finally {
      setCancelling(false);
    }
  };

  const openCancelDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setCancelDialogOpen(true);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Onaylandı';
      case 'cancelled':
        return 'İptal Edildi';
      case 'pending':
        return 'Beklemede';
      default:
        return status;
    }
  };

  const isReservationCancellable = (reservation: Reservation) => {
    const now = new Date();
    const startTime = new Date(reservation.startDatetime);
    const status = reservation.status || reservation.bookingStatus;
    return status === 'confirmed' && startTime > now;
  };

  if (loading) {
    return (
      <NavBar>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        </Container>
      </NavBar>
    );
  }

  return (
    <NavBar>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarIcon />
            Rezervasyonlarım
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {reservations.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Henüz rezervasyonunuz bulunmuyor.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Ana sayfadan oda arayarak rezervasyon yapabilirsiniz.
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {reservations.map((reservation) => (
                <Box key={reservation.id} sx={{ width: { xs: '100%', md: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)' } }}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="div">
                          <RoomIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                          {reservation.room?.name || reservation.roomNumber}
                        </Typography>
                        <Chip 
                          label={getStatusText(reservation.status || reservation.bookingStatus)} 
                          color={getStatusColor(reservation.status || reservation.bookingStatus)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                        {reservation.userName}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                        {formatDateTime(reservation.startDatetime)}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <TimeIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                        {formatDateTime(reservation.endDatetime)}
                      </Typography>
                      
                      {reservation.purpose && (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          <strong>Amaç:</strong> {reservation.purpose}
                        </Typography>
                      )}
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Konum:</strong> {reservation.room?.location || 'Belirtilmemiş'}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        <strong>Kapasite:</strong> {reservation.room?.capacity || reservation.roomFeature?.capacity} kişi
                      </Typography>
                    </CardContent>
                    
                    <CardActions>
                      {isReservationCancellable(reservation) && (
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => openCancelDialog(reservation)}
                        >
                          İptal Et
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Cancel Confirmation Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
          aria-labelledby="cancel-dialog-title"
        >
          <DialogTitle id="cancel-dialog-title">
            Rezervasyonu İptal Et
          </DialogTitle>
          <DialogContent>
            <Typography>
              Bu rezervasyonu iptal etmek istediğinizden emin misiniz?
            </Typography>
            {selectedReservation && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2">{selectedReservation.room?.name || selectedReservation.roomNumber}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(selectedReservation.startDatetime)} - {formatDateTime(selectedReservation.endDatetime)}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelDialogOpen(false)} disabled={cancelling}>
              Vazgeç
            </Button>
            <Button 
              onClick={handleCancelReservation} 
              color="error" 
              disabled={cancelling}
              startIcon={cancelling ? <CircularProgress size={16} /> : <DeleteIcon />}
            >
              {cancelling ? 'İptal Ediliyor...' : 'İptal Et'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
        >
          <Alert onClose={() => setSuccess(null)} severity="success">
            {success}
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </NavBar>
  );
}

export default MyBookingsPage;
