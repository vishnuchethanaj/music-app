import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type AdminProtectedRouteProps = {
  children: ReactElement;
};

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-brand-primary/20 border-t-brand-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
