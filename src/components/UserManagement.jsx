import { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Select, MenuItem, FormControl, Modal, TextField, Box } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from '../context/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'botanist',
    pseudo: '',
    firstname: '',
    lastname: ''
  });

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    API.get('/users')
      .then(response => {
        const sortedUsers = response.data.sort((a, b) => b.wantToBeKeeper - a.wantToBeKeeper);
        setUsers(sortedUsers);
        console.log("response.data", response);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch users:", error);
        setLoading(false);
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

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.patch(`/user/${userId}`, { role: newRole });
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    } catch (error) {
      console.error("Failed to update user role:", error);
      // Handle error appropriately
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateUser = async () => {
    try {
      await API.post('/user', newUser);
      setUsers([...users, newUser]);
      handleClose();
    } catch (error) {
      console.error("Failed to create user:", error);
      // Handle error appropriately
    }
  };

  const handleLogout = async () => {
    const token = Cookies.get('userToken');
    if (token) {
      try {
        await API.post('/denyjwt', { token });
        Cookies.remove('userToken');
        setUser(null);
        navigate('/login');
      } catch (error) {
        console.error("Failed to logout:", error);
        // Handle error appropriately
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4">Espace administateur</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Pseudo</TableCell>
            <TableCell>Rôle</TableCell>
            <TableCell>Veut être gardien</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.pseudo}</TableCell>
              <TableCell>
                <FormControl variant="outlined" fullWidth>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <MenuItem value="admin">Administrateur</MenuItem>
                    <MenuItem value="botanist">Botaniste</MenuItem>
                    <MenuItem value="keeper">Gardien</MenuItem>
                    <MenuItem value="owner">Propriétaire</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                {user.wantToBeKeeper && user.role === 'owner' ? <CheckCircle style={{ color: 'green' }} /> : <Cancel style={{ color: 'red' }} />}
              </TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(user.id)} color="secondary">Supprimer</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginTop: '20px' }}>Créer un utilisateur</Button>
      <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginLeft: '10px', marginTop: '20px' }}>Se déconnecter</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">Créer un utilisateur</Typography>
          <TextField label="Email" name="email" value={newUser.email} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Mot de passe" name="password" type="password" value={newUser.password} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Pseudo" name="pseudo" value={newUser.pseudo} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Prénom" name="firstname" value={newUser.firstname} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Nom" name="lastname" value={newUser.lastname} onChange={handleInputChange} fullWidth margin="normal" />
          <FormControl variant="outlined" fullWidth margin="normal">
            <Select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
            >
              <MenuItem value="admin">Administateur</MenuItem>
              <MenuItem value="botanist">Botaniste</MenuItem>
              <MenuItem value="keeper">Gardien</MenuItem>
              <MenuItem value="owner">Propriétaire</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleCreateUser} fullWidth>Créer</Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default UserManagement;
