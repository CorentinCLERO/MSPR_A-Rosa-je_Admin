/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('userToken');
    if (token) {
      API.post('/verify_admin_token', { token })
        .then(response => {
          console.log('Token verified, user:', response.data.user);
          setUser(response.data.user);
        })
        .catch(error => {
          console.error("Token verification failed:", error);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
