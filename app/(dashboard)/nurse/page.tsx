'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import NursePortal from '@/components/portals/NursePortal';
import { useAuth } from '@/context/AuthContext';

export default function NursePage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['nurse']}>
      <NursePortal user={user} logout={logout} />
    </ProtectedRoute>
  );
}
