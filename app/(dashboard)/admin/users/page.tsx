import React from 'react';
import SubPageSkeleton from '@/components/SubPageSkeleton';

export default function AdminUsersPage() {
  return (
    <SubPageSkeleton
      role="admin"
      subTitle="user management"
      description="Register, review, suspend, or update permissions of clinical employees and patients."
      allowedRoles={['admin']}
    />
  );
}
