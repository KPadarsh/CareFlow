import React from 'react';
import SubPageSkeleton from '@/components/SubPageSkeleton';

export default function PatientPrescriptionsPage() {
  return (
    <SubPageSkeleton
      role="patient"
      subTitle="my prescriptions"
      description="View digital medicine prescriptions and instructions issued by your doctors."
      allowedRoles={['patient']}
    />
  );
}
