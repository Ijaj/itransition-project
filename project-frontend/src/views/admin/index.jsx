import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  IconButton,
  CircularProgress,
  Typography,
  Box,
  Link
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ArrowRight, ArrowRightAltRounded } from '@mui/icons-material';
import CreateUserDialog from './create-user';
import DeleteUserDialog from './delete-user';

function generateDummyUsers(count) {
  const _users = [];
  for (let i = 0; i < count; i++) {
    _users.push({
      id: i + 1,
      name: `User ${i + 1}`,
      username: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: `password${i + 1}`
    });
  }
  return _users;
}

const dummyUsers = generateDummyUsers(50);

export default function UserList() {
  const [users, setUsers] = useState([]); // Assume this is populated with user data
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      console.log('timer executed');
      setUsers(dummyUsers);
    }, 3000);

  }, []);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  };

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function handleCreateUser(newUser) {
    // Logic to create a new user
    setUsers([...users, newUser]);
    setOpenCreateDialog(false);
  };

  function handleEditUser(updatedUser) {
    // Logic to update the user
    const updatedUsers = users.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    setSelectedUser(null);
    setOpenCreateDialog(false);
  };

  function handleDeleteUser() {
    // Logic to delete the user
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setOpenDeleteDialog(false);
  };

  console.log(users);

  return (
    <Paper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreateDialog(true)}
        >
          Create New User
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Collection</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    {user.name}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => {
                      setSelectedUser(user);
                      setOpenCreateDialog(true);
                    }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                      setSelectedUser(user);
                      setOpenDeleteDialog(true);
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell component={Link} href={`/collections/${user.id}`} underline="none">
                    <ArrowRightAltRounded />
                  </TableCell>
                </TableRow>
              ))) :
              (<TableRow key={0} hover>
                <TableCell colSpan={4}>
                  <Typography textAlign={'center'}>
                    <CircularProgress />
                  </Typography>
                </TableCell>
              </TableRow>)
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <CreateUserDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreateUser={handleCreateUser}
        onEditUser={handleEditUser}
        user={selectedUser}
      />

      <DeleteUserDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDeleteUser={handleDeleteUser}
        user={selectedUser}
      />
    </Paper>
  );
};

