import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SellerRoute = () => {
  const { currentUser, loading } = useSelector((state) => state.user);

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Check if user is authenticated and is a seller
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role !== 'seller') {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default SellerRoute;