import React from 'react';
import SubPageSkeleton from '@/components/SubPageSkeleton';

export default function PharmacyInventoryPage() {
  return (
    <SubPageSkeleton
      role="pharmacy"
      subTitle="stock inventory"
      description="Record newly arrived batches, track expiry metrics, and configure low stock notifications."
      allowedRoles={['pharmacist']}
    />
  );
}
