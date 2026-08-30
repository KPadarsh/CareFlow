'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SkeletonPortal from '@/components/SkeletonPortal';
import { useAuth } from '@/context/AuthContext';

export default function DoctorPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <SkeletonPortal role="doctor" user={user} logout={logout} />
    </ProtectedRoute>
  );
}
