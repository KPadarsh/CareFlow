'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SkeletonPortal from '@/components/SkeletonPortal';
import { useAuth } from '@/context/AuthContext';

export default function BillingPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['billing_officer']}>
      <SkeletonPortal role="billing_officer" user={user} logout={logout} />
    </ProtectedRoute>
  );
}
