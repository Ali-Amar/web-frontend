import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure, signOut } from '../features/auth/authSlice';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // Firebase auth instance
  const auth = getAuth(app);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Verify token with backend
          const response = await fetch("http://localhost:8080/api/users/verify", {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`
            }
          });
          const data = await response.json();
          
          if (response.ok) {
            dispatch(signInSuccess({ user: data.user, accessToken: data.accessToken }));
          } else {
            dispatch(signOut());
          }
        } catch (error) {
          dispatch(signInFailure(error.message));
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, auth]);

  // Regular sign in
  const signIn = async (email, password) => {
    try {
      dispatch(signInStart());
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.message);
      }

      dispatch(signInSuccess({ user: data.data.user, accessToken: data.data.accessToken }));
      return true;
    } catch (error) {
      dispatch(signInFailure(error.message));
      return false;
    }
  };

  // Sign up
  const signUp = async (userData) => {
    try {
      dispatch(signInStart());
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.message);
      }

      // Automatically sign in after successful registration
      return await signIn(userData.email, userData.password);
    } catch (error) {
      dispatch(signInFailure(error.message));
      return false;
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      dispatch(signOut());
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Check if user has required role
  const hasRole = (requiredRole) => {
    return currentUser?.role === requiredRole;
  };

  // Check if user has access to specific route
  const hasAccess = (requiredRoles) => {
    return currentUser && (
      requiredRoles.includes(currentUser.role) || 
      currentUser.role === 'admin'
    );
  };

  return {
    currentUser,
    loading,
    error,
    signIn,
    signUp,
    signOut: handleSignOut,
    hasRole,
    hasAccess,
    isAuthenticated: !!currentUser
  };
};

export default useAuth;