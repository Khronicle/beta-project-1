import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <p className="text-center text-slate-500">Loading…</p>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <span className="text-6xl">🚫</span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Access denied</h1>
        <p className="text-slate-500 dark:text-slate-400">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
