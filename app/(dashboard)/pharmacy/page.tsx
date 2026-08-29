'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SkeletonPortal from '@/components/portals/SkeletonPortal';
import { useAuth } from '@/context/AuthContext';

export default function PharmacyPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <SkeletonPortal role="pharmacist" user={user} logout={logout} />
    </ProtectedRoute>
  );
}
