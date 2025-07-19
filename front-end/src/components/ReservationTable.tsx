import React, { useEffect, useState } from 'react';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import type { CreateReservationRequest } from '../services/roomService';
import {
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import { roomService } from '../services/roomService';

interface Reservation {
  id: number;
  roomNumber: string;
  userName: string;
  userEmail: string;
  startDatetime: string;
  endDatetime: string;
  bookingStatus: string;
  purpose?: string;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  { field: 'roomNumber', headerName: 'Room', flex: 1 },
  { field: 'userName', headerName: 'User Name', flex: 1 },
  { field: 'userEmail', headerName: 'User Email', flex: 2 },
  { field: 'startDatetime', headerName: 'Start', flex: 1.2 },
  { field: 'endDatetime', headerName: 'End', flex: 1.2 },
  { field: 'bookingStatus', headerName: 'Status', flex: 1 },
  { field: 'purpose', headerName: 'Purpose', flex: 1.5 },
];

export default function ReservationTable() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editReservation, setEditReservation] = useState<Partial<Reservation>>(
    {}
  );
  const [isNew, setIsNew] = useState(false);

  const fetchReservations = async () => {
    const data = await roomService.getReservations();
    setReservations(data);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleRowClick = (params: GridRowParams) => {
    setEditReservation(params.row as Reservation);
    setIsNew(false);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditReservation({
      roomNumber: '',
      userName: '',
      userEmail: '',
      startDatetime: '',
      endDatetime: '',
      bookingStatus: 'confirmed',
      purpose: '',
    });
    setIsNew(true);
    setDrawerOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditReservation({ ...editReservation, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (isNew) {
      const req: CreateReservationRequest = {
        roomNumber: editReservation.roomNumber || '',
        userName: editReservation.userName || '',
        userEmail: editReservation.userEmail || '',
        startDatetime: editReservation.startDatetime || '',
        endDatetime: editReservation.endDatetime || '',
        purpose: editReservation.purpose || '',
      };
      await roomService.createReservation(req);
    } else if (editReservation.id) {
      await roomService.updateReservation(editReservation.id, editReservation);
    }
    setDrawerOpen(false);
    fetchReservations();
  };

  const handleDelete = async () => {
    if (editReservation.id) {
      await roomService.deleteReservation(editReservation.id);
      setDrawerOpen(false);
      fetchReservations();
    }
  };

  return (
    <Box>
      <Button
        variant='contained'
        color='primary'
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Add Reservation
      </Button>
      <DataGrid
        rows={reservations}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 20, 50]}
        onRowClick={handleRowClick}
        sx={{ bgcolor: '#fff', borderRadius: 2, mx: 'auto', width: '100%' }}
      />
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            pt: 6,
            width: 400,
            boxShadow: 6,
            borderRadius: '16px 0 0 16px',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            {isNew ? 'Add Reservation' : 'Edit Reservation'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label='Room Number'
              name='roomNumber'
              value={editReservation.roomNumber || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label='User Name'
              name='userName'
              value={editReservation.userName || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label='User Email'
              name='userEmail'
              value={editReservation.userEmail || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label='Start Datetime'
              name='startDatetime'
              value={editReservation.startDatetime || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label='End Datetime'
              name='endDatetime'
              value={editReservation.endDatetime || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label='Status'
              name='bookingStatus'
              value={editReservation.bookingStatus || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label='Purpose'
              name='purpose'
              value={editReservation.purpose || ''}
              onChange={handleChange}
              fullWidth
            />
            <Stack direction='row' spacing={2}>
              <Button variant='contained' color='primary' onClick={handleSave}>
                Save
              </Button>
              {!isNew && (
                <Button variant='outlined' color='error' onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
