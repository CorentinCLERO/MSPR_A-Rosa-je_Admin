import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users')
    .then(response => {
      setUsers(response.data);
      console.log("response.data", response);
      setLoading(false);
    })
    .catch(error => {
      console.error("Failed to fetch users:", error);
    });
  }, []);

  const handleDelete = async (userId) => {
    try {
      await API.delete(`/user/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
      // Handle error appropriately
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4">User Management</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Pseudo</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.pseudo}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(user.id)} color="secondary">Delete</Button>
                <Button>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default UserManagement;
