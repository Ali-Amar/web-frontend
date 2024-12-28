import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MentorRoute = () => {
  const { currentUser, loading } = useSelector((state) => state.user);

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Check if user is authenticated and is a mentor
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role !== 'mentor') {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default MentorRoute;