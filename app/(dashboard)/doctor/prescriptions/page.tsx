import React from 'react';
import SubPageSkeleton from '@/components/SubPageSkeleton';

export default function DoctorPrescriptionsPage() {
  return (
    <SubPageSkeleton
      role="doctor"
      subTitle="digital prescriptions"
      description="Issue digital prescriptions directly to the pharmacist for medicine dispensing."
      allowedRoles={['doctor']}
    />
  );
}
