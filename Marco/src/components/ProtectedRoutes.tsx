// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';


interface ProtectedRouteProps {
  roles?: string[];
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return <Navigate to="/account" replace />;

  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
