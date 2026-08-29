import React from 'react';
import SubPageSkeleton from '@/components/portals/SubPageSkeleton';

export default function AdminSettingsPage() {
  return (
    <SubPageSkeleton
      role="admin"
      subTitle="system settings"
      description="Configure hospital wards, departments, and general system variables."
      allowedRoles={['admin']}
    />
  );
}
