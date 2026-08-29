import React from 'react';
import SubPageSkeleton from '@/components/portals/SubPageSkeleton';

export default function ReceptionistPatientsPage() {
  return (
    <SubPageSkeleton
      role="receptionist"
      subTitle="patients directory"
      description="Register new patients, view demographics, and check billing profiles."
      allowedRoles={['receptionist']}
    />
  );
}
