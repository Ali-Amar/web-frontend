import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const NGORoute = () => {
  const { currentUser, loading } = useSelector((state) => state.user);

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Check if user is authenticated and is an NGO
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role !== 'ngo') {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default NGORoute;