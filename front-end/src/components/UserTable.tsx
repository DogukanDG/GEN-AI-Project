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
import { userApi } from '../services/api';
import type { User } from '../services/authService';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'surname', headerName: 'Surname', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 2 },
  { field: 'role', headerName: 'Role', flex: 1 },
];

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editUser, setEditUser] = useState<Partial<User>>({});
  const [isNew, setIsNew] = useState(false);

  const fetchUsers = async () => {
    const data = await userApi.getAll();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRowClick = (params: GridRowParams) => {
    setEditUser(params.row as User);
    setIsNew(false);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditUser({ name: '', surname: '', email: '', role: 'normal' });
    setIsNew(true);
    setDrawerOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (isNew) {
      await userApi.create(editUser as User);
    } else if (editUser.id) {
      await userApi.update(editUser.id, editUser);
    }
    setDrawerOpen(false);
    fetchUsers();
  };

  const handleDelete = async () => {
    if (editUser.id) {
      await userApi.delete(editUser.id);
      setDrawerOpen(false);
      fetchUsers();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Box sx={{ width: '100%', mx: 'auto', maxWidth: 1100 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleAdd}
          sx={{ mb: 1 }}
        >
          Add User
        </Button>
        <DataGrid
          rows={users}
          columns={columns}
          autoHeight
          pageSizeOptions={[10, 20, 50]}
          onRowClick={handleRowClick}
          sx={{ bgcolor: '#fff', borderRadius: 2, width: '100%' }}
        />
      </Box>
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            pt: 6,
            width: 350,
            boxShadow: 6,
            borderRadius: '16px 0 0 16px',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            {isNew ? 'Add User' : 'Edit User'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label='Name'
              name='name'
              value={editUser.name || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label='Surname'
              name='surname'
              value={editUser.surname || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label='Email'
              name='email'
              value={editUser.email || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label='Role'
              name='role'
              value={editUser.role || ''}
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
