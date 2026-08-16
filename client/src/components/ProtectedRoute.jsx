import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // Show a loading screen while auth state is being verified
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Restrict access if the user's role is not authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-900">
        <div className="rounded-full bg-red-100 p-4 dark:bg-red-950/30">
          <svg className="h-12 w-12 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-800 dark:text-slate-100">Access Denied</h1>
        <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
          Your role (<span className="font-semibold text-slate-950 dark:text-slate-200 capitalize">{user.role.replace('_', ' ')}</span>) does not have permission to view this resource.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/10 hover:bg-teal-700 transition duration-150"
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
