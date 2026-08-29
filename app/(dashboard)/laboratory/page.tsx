'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SkeletonPortal from '@/components/portals/SkeletonPortal';
import { useAuth } from '@/context/AuthContext';

export default function LaboratoryPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['lab_technician']}>
      <SkeletonPortal role="lab_technician" user={user} logout={logout} />
    </ProtectedRoute>
  );
}
