'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ReceptionPortal from '@/components/portals/ReceptionPortal';
import { useAuth } from '@/context/AuthContext';

export default function ReceptionistPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['receptionist']}>
      <ReceptionPortal user={user} logout={logout} />
    </ProtectedRoute>
  );
}
