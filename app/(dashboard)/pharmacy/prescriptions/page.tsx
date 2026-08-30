import React from 'react';
import SubPageSkeleton from '@/components/SubPageSkeleton';

export default function PharmacyPrescriptionsPage() {
  return (
    <SubPageSkeleton
      role="pharmacy"
      subTitle="dispense medicines"
      description="Inspect doctor digital prescriptions and record medicine dispensing status."
      allowedRoles={['pharmacist']}
    />
  );
}
