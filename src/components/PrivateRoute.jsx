/* eslint-disable react/prop-types */
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("user",user);
  console.log("loading",loading);

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/users');
      } else {
        navigate('/login');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default PrivateRoute;
