'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PatientPortal from '@/components/portals/PatientPortal';
import { useAuth } from '@/context/AuthContext';

export default function PatientPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <PatientPortal user={user} logout={logout} />
    </ProtectedRoute>
  );
}
