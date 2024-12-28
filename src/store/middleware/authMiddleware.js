// Authentication middleware to handle token management and user sessions
const authMiddleware = (store) => (next) => (action) => {
  // Handle successful sign in
  if (action.type === 'user/signInSuccess') {
    const { accessToken } = action.payload;
    if (accessToken) {
      // Store the token in localStorage
      localStorage.setItem('accessToken', accessToken);
      
      // Set the authorization header for future requests
      if (window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
          if (accessToken) {
            options.headers = {
              ...options.headers,
              'Authorization': `Bearer ${accessToken}`
            };
          }
          return originalFetch(url, options);
        };
      }
    }
  }

  // Handle sign out
  if (action.type === 'user/signOut') {
    // Clear token from localStorage
    localStorage.removeItem('accessToken');
    
    // Clear any persisted user data
    localStorage.removeItem('persist:root');
    
    // Reset fetch to original behavior
    if (window.fetch) {
      window.fetch = window.originalFetch || window.fetch;
    }
  }

  // Handle token expiration or invalidation
  if (action.type === 'user/tokenExpired' || action.type === 'user/tokenInvalid') {
    // Clear token and user data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('persist:root');
    
    // Dispatch sign out action
    store.dispatch({ type: 'user/signOut' });
  }

  // Handle token refresh
  if (action.type === 'user/refreshToken') {
    const { accessToken } = action.payload;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
  }

  // Handle user updates
  if (action.type === 'user/updateSuccess') {
    const { accessToken } = action.payload;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
  }

  return next(action);
};

export default authMiddleware;