import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Cookies from 'js-cookie';
import { TextField, Button, Container, Typography } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate('/users');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/login_admin', { email, password });
      Cookies.set('userToken', response.data.token, { expires: 1, secure: true, sameSite: 'Strict' });
      setUser(response.data.user);
      navigate('/users');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Admin Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Login</Button>
      </form>
    </Container>
  );
};

export default LoginPage;
