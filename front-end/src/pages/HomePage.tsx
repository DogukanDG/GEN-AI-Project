import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Alert,
  Snackbar
} from "@mui/material";
import { 
  Room as RoomIcon,
  People as PeopleIcon,
  Computer as ProjectorIcon,
  Air as AirIcon,
  Mic as MicIcon,
  Camera as CameraIcon,
  VolumeOff as QuietIcon,
  WbSunny as LightIcon
} from "@mui/icons-material";
import NavBar from "../components/NavBar";
import { roomService } from "../services/roomService";
import type { RoomMatch, RoomSearchResponse } from "../services/roomService";
import { authService } from "../services/authService";

type Message = 
  | { role: "user"; content: string }
  | { role: "assistant"; content: string }
  | { role: "assistant-rooms"; content: string; data: RoomSearchResponse };

function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomMatch | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    userName: "",
    userEmail: "",
    startDatetime: "",
    endDatetime: "",
    purpose: ""
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  useEffect(() => {
    // Get user info for pre-filling
    const user = authService.getStoredUser();
    if (user) {
      setBookingDetails(prev => ({
        ...prev,
        userName: `${user.name} ${user.surname}`,
        userEmail: user.email
      }));
    }
  }, []);

  const handleRoomBooking = (room: RoomMatch) => {
    setSelectedRoom(room);
    setBookingDialogOpen(true);
  };

  const handleBookingSubmit = async () => {
    if (!selectedRoom) return;

    try {
      setLoading(true);
      const result = await roomService.createReservation({
        roomNumber: selectedRoom.roomNumber,
        userName: bookingDetails.userName,
        userEmail: bookingDetails.userEmail,
        startDatetime: bookingDetails.startDatetime,
        endDatetime: bookingDetails.endDatetime,
        purpose: bookingDetails.purpose
      });

      setSnackbar({
        open: true,
        message: result.confirmationMessage,
        severity: "success"
      });

      setBookingDialogOpen(false);
      setSelectedRoom(null);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Rezervasyon oluşturulurken hata oluştu",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const userMessage: Message = { role: "user", content: prompt };
    setPrompt("");
    setLoading(true);

    // Show user message immediately
    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await roomService.searchRoomsWithAI({ prompt });
      
      const assistantMessage: Message = {
        role: "assistant-rooms",
        content: result.message,
        data: result
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: "assistant",
        content: error.response?.data?.message || "Arama sırasında bir hata oluştu. Lütfen tekrar deneyin."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderRoomFeatures = (room: RoomMatch["room"]) => {
    const features = [];
    
    if (room.hasProjector) features.push(<Chip key="projector" icon={<ProjectorIcon />} label="Projektör" size="small" />);
    if (room.hasAirConditioner) features.push(<Chip key="ac" icon={<AirIcon />} label="Klima" size="small" />);
    if (room.hasMicrophone) features.push(<Chip key="mic" icon={<MicIcon />} label="Mikrofon" size="small" />);
    if (room.hasCamera) features.push(<Chip key="camera" icon={<CameraIcon />} label="Kamera" size="small" />);
    if (room.hasNoiseCancelling) features.push(<Chip key="quiet" icon={<QuietIcon />} label="Sessiz" size="small" />);
    if (room.hasNaturalLight) features.push(<Chip key="light" icon={<LightIcon />} label="Doğal Işık" size="small" />);

    return features;
  };

  return (
    <NavBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          px: 2,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            py: 2,
            mb: 2,
          }}
        >
          {messages.map((msg, index) => {
            if (msg.role === "assistant-rooms") {
              return (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    alignSelf: "flex-start",
                    backgroundColor: "#f0f0f0",
                    maxWidth: "90%",
                  }}
                >
                  <Typography sx={{ color: "#000", mb: 2, fontWeight: "bold" }}>
                    {msg.content}
                  </Typography>

                  {msg.data.rooms.length > 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {msg.data.rooms.map((room, roomIndex) => (
                        <Card key={roomIndex} sx={{ width: "100%" }}>
                          <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                              <Typography variant="h6" component="h3">
                                {room.roomNumber}
                              </Typography>
                              <Chip
                                label={`%${room.matchScore} Uyumlu`}
                                color={room.matchScore >= 80 ? "success" : room.matchScore >= 60 ? "warning" : "default"}
                                size="small"
                              />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                <PeopleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                                Kapasite: {room.room.capacity} kişi
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                <RoomIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                                Tür: {room.room.roomType === "classroom" ? "Sınıf" : "Çalışma Odası"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Kat: {room.room.floor}, Alan: {room.room.areaSqm}m²
                              </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
                                Özellikler:
                              </Typography>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {renderRoomFeatures(room.room)}
                              </Box>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
                                Uyum Nedenleri:
                              </Typography>
                              {room.matchReasons.map((reason, reasonIndex) => (
                                <Typography key={reasonIndex} variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                                  • {reason}
                                </Typography>
                              ))}
                            </Box>

                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => handleRoomBooking(room)}
                              disabled={loading}
                            >
                              Rezervasyon Yap
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Alert severity="info">
                      Aradığınız kriterlere uygun oda bulunamadı. Lütfen farklı kriterler ile arama yapın.
                    </Alert>
                  )}
                </Paper>
              );
            } else {
              return (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 1,
                    maxWidth: "75%",
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor: msg.role === "user" ? "#1976d2" : "#ffffff",
                    color: msg.role === "user" ? "#fff" : "#000",
                  }}
                >
                  <Typography>{msg.content}</Typography>
                </Paper>
              );
            }
          })}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "flex-end",
            pb: 2,
          }}
        >
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={6}
            placeholder="Oda ihtiyacınızı doğal dilde yazın... Örn: '5 kişi için sunum odası lazım, projektör ve klima olsun'"
            variant="outlined"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ height: "42px" }}
          >
            Ara
          </Button>
        </Box>

        {/* Booking Dialog */}
        <Dialog
          open={bookingDialogOpen}
          onClose={() => setBookingDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Rezervasyon Yap - {selectedRoom?.roomNumber}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="İsim Soyisim"
                value={bookingDetails.userName}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, userName: e.target.value }))}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="E-posta"
                type="email"
                value={bookingDetails.userEmail}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, userEmail: e.target.value }))}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Başlangıç Tarihi ve Saati"
                type="datetime-local"
                value={bookingDetails.startDatetime}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, startDatetime: e.target.value }))}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Bitiş Tarihi ve Saati"
                type="datetime-local"
                value={bookingDetails.endDatetime}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, endDatetime: e.target.value }))}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Kullanım Amacı (Opsiyonel)"
                multiline
                rows={3}
                value={bookingDetails.purpose}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, purpose: e.target.value }))}
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookingDialogOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleBookingSubmit}
              variant="contained"
              disabled={loading || !bookingDetails.userName || !bookingDetails.userEmail || !bookingDetails.startDatetime || !bookingDetails.endDatetime}
            >
              {loading ? <CircularProgress size={20} /> : "Rezervasyon Yap"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </NavBar>
  );
}

export default HomePage;
