import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

function CreateUserDialog({ open, onClose, onCreateUser, onEditUser, user }) {
  const [newUser, setNewUser] = useState({
    name: user ? user.name : '',
    username: user ? user.username : '',
    email: user ? user.email : '',
    password: '',
  });

  function handleChange(e) {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  function handleSubmit() {
    if (user) {
      onEditUser();
    }
    else {
      onCreateUser(newUser);
    }
    setNewUser({
      name: user ? user.name : '',
      username: user ? user.username : '',
      email: user ? user.email : '',
      password: '',
    });
  };

  function onSubmit() {
    const url = user ? 'update url' : 'create url'
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{user ? `Update User: ${user.name}` : 'Create New User'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Name"
          type="text"
          fullWidth
          value={newUser.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="username"
          label="Username"
          type="text"
          fullWidth
          value={newUser.username}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={newUser.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="password"
          label="Password"
          type="password"
          fullWidth
          value={newUser.password}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;