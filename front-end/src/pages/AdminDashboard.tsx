import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import UserTable from '../components/UserTable';
import ReservationTable from '../components/ReservationTable';
import RoomTable from '../components/RoomTable';
import { authService } from '../services/authService';

const drawerWidth = 220;

const sections = [
  { key: 'users', label: 'Users' },
  { key: 'reservations', label: 'Reservations' },
  { key: 'rooms', label: 'Rooms' },
];

export default function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState('users');

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f6f7fb' }}>
      <AppBar position='fixed' sx={{ zIndex: 1201, bgcolor: '#26292f' }}>
        <Toolbar>
          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            Prisma Studio (Admin Panel)
          </Typography>
          <Button color='inherit' onClick={authService.logout} sx={{ ml: 2 }}>
            Exit
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#23272f',
            color: '#fff',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {sections.map((section) => (
              <ListItem key={section.key} disablePadding>
                <ListItemButton
                  selected={selectedSection === section.key}
                  onClick={() => setSelectedSection(section.key)}
                  sx={{
                    '&.Mui-selected': { bgcolor: '#353945', color: '#fff' },
                    '&:hover': { bgcolor: '#353945' },
                  }}
                >
                  <ListItemText primary={section.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component='main'
        sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, mt: 8 }}
      >
        {/* Burada seçili sekmeye göre tablo ve detay paneli render edilecek */}
        <Typography variant='h5' sx={{ mb: 2 }}>
          {sections.find((s) => s.key === selectedSection)?.label}
        </Typography>
        {/* TODO: Tablo ve detay/edit paneli eklenecek */}
        {selectedSection === 'users' && <UserTable />}
        {selectedSection === 'reservations' && <ReservationTable />}
        {selectedSection === 'rooms' && <RoomTable />}
      </Box>
    </Box>
  );
}
