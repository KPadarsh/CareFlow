import React from 'react';
import SubPageSkeleton from '@/components/portals/SubPageSkeleton';

export default function AdminDoctorsPage() {
  return (
    <SubPageSkeleton
      role="admin"
      subTitle="doctor directory"
      description="Manage doctors directory, departments, and consultation hourly rates."
      allowedRoles={['admin']}
    />
  );
}
