import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();

  if (user && user.isAdmin) {
    return <Outlet />; 
  }

  return <Navigate to="/" replace />;
};

export default AdminRoute;