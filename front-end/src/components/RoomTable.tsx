import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { adminService } from '../services/adminService';

interface Room {
  id: number;
  roomNumber: string;
  floor: number;
  roomType: string;
  capacity: number;
  areaSqm: number;
  windowCount: number;
  hasNaturalLight: boolean;
  hasProjector: boolean;
  hasMicrophone: boolean;
  hasCamera: boolean;
  hasAirConditioner: boolean;
  hasNoiseCancelling: boolean;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'roomNumber', headerName: 'Room Number', width: 120 },
  { field: 'floor', headerName: 'Floor', width: 80 },
  { field: 'roomType', headerName: 'Type', width: 120 },
  { field: 'capacity', headerName: 'Capacity', width: 100 },
  { field: 'areaSqm', headerName: 'Area (sqm)', width: 110 },
  { field: 'windowCount', headerName: 'Windows', width: 90 },
  {
    field: 'hasNaturalLight',
    headerName: 'Natural Light',
    width: 120,
    type: 'boolean',
  },
  {
    field: 'hasProjector',
    headerName: 'Projector',
    width: 100,
    type: 'boolean',
  },
  {
    field: 'hasMicrophone',
    headerName: 'Microphone',
    width: 110,
    type: 'boolean',
  },
  { field: 'hasCamera', headerName: 'Camera', width: 100, type: 'boolean' },
  { field: 'hasAirConditioner', headerName: 'A/C', width: 80, type: 'boolean' },
  {
    field: 'hasNoiseCancelling',
    headerName: 'Noise Cancel',
    width: 120,
    type: 'boolean',
  },
];

export default function RoomTable() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Partial<Room>>({});
  const [isNew, setIsNew] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await adminService.getRoomFeatures();
      setRooms(response.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        console.error(
          'Room API error:',
          axiosError.response?.data?.message || error.message || error
        );
      } else {
        console.error('Room API error:', error);
      }
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleRowClick = (params: GridRowParams) => {
    setEditRoom(params.row as Room);
    setIsNew(false);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditRoom({
      roomNumber: '',
      floor: 1,
      roomType: '',
      capacity: 1,
      areaSqm: 1.0,
      windowCount: 0,
      hasNaturalLight: false,
      hasProjector: false,
      hasMicrophone: false,
      hasCamera: false,
      hasAirConditioner: false,
      hasNoiseCancelling: false,
    });
    setIsNew(true);
    setDrawerOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue: any = value;
    
    // Convert numeric fields to proper types
    if (type === 'number') {
      if (name === 'areaSqm') {
        processedValue = parseFloat(value) || 0;
      } else if (['floor', 'capacity', 'windowCount'].includes(name)) {
        processedValue = parseInt(value) || 0;
      }
    } else if (type === 'checkbox') {
      processedValue = checked;
    }
    
    setEditRoom({
      ...editRoom,
      [name]: processedValue,
    });
  };

  const handleSave = async () => {
    try {
      if (isNew) {
        await adminService.createRoomFeature(editRoom);
      } else if (editRoom.id) {
        await adminService.updateRoomFeature(editRoom.id, editRoom);
      }
      setDrawerOpen(false);
      fetchRooms();
    } catch (error) {
      console.error('Save room error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (editRoom.id) {
        await adminService.deleteRoomFeature(editRoom.id);
        setDrawerOpen(false);
        fetchRooms();
      }
    } catch (error) {
      console.error('Delete room error:', error);
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
        Add Room
      </Button>
      <DataGrid
        rows={rooms}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 20, 50]}
        onRowClick={handleRowClick}
        sx={{ bgcolor: '#fff', borderRadius: 2 }}
      />
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            pt: 0,
            width: 400,
            boxShadow: 6,
            borderRadius: '16px 0 0 16px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            p: 0,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            p: 0,
          }}
        >
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid #eee', bgcolor: '#fff' }}>
            <Typography variant='h6' gutterBottom>
              {isNew ? 'Add Room' : 'Edit Room'}
            </Typography>
          </Box>
          {/* Scrollable Form */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label='Room Number'
                name='roomNumber'
                value={editRoom.roomNumber || ''}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label='Floor'
                name='floor'
                type='number'
                value={editRoom.floor || 0}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label='Type'
                name='roomType'
                value={editRoom.roomType || ''}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label='Capacity'
                name='capacity'
                type='number'
                value={editRoom.capacity || 0}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label='Area (sqm)'
                name='areaSqm'
                type='number'
                value={editRoom.areaSqm || 0}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label='Windows'
                name='windowCount'
                type='number'
                value={editRoom.windowCount || 0}
                onChange={handleChange}
                fullWidth
              />
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={!!editRoom.hasNaturalLight}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      hasNaturalLight: e.target.checked,
                    })
                  }
                />
                <Typography variant='body2'>Natural Light</Typography>
              </Box>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={!!editRoom.hasProjector}
                  onChange={(e) =>
                    setEditRoom({ ...editRoom, hasProjector: e.target.checked })
                  }
                />
                <Typography variant='body2'>Projector</Typography>
              </Box>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={!!editRoom.hasMicrophone}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      hasMicrophone: e.target.checked,
                    })
                  }
                />
                <Typography variant='body2'>Microphone</Typography>
              </Box>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={!!editRoom.hasCamera}
                  onChange={(e) =>
                    setEditRoom({ ...editRoom, hasCamera: e.target.checked })
                  }
                />
                <Typography variant='body2'>Camera</Typography>
              </Box>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={!!editRoom.hasAirConditioner}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      hasAirConditioner: e.target.checked,
                    })
                  }
                />
                <Typography variant='body2'>A/C</Typography>
              </Box>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={!!editRoom.hasNoiseCancelling}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      hasNoiseCancelling: e.target.checked,
                    })
                  }
                />
                <Typography variant='body2'>Noise Cancel</Typography>
              </Box>
            </Stack>
          </Box>
          {/* Sticky Footer */}
          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              p: 3,
              borderTop: '1px solid #eee',
              bgcolor: '#fff',
              zIndex: 1,
            }}
          >
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
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
