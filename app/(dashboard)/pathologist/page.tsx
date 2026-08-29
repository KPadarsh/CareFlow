'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SkeletonPortal from '@/components/portals/SkeletonPortal';
import { useAuth } from '@/context/AuthContext';

export default function PathologistPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['pathologist']}>
      <SkeletonPortal role="pathologist" user={user} logout={logout} />
    </ProtectedRoute>
  );
}
