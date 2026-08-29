'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SkeletonPortal from '@/components/portals/SkeletonPortal';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SkeletonPortal role="admin" user={user} logout={logout} />
    </ProtectedRoute>
  );
}
