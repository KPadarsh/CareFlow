import React from 'react';
import SubPageSkeleton from '@/components/portals/SubPageSkeleton';

export default function PatientBillsPage() {
  return (
    <SubPageSkeleton
      role="patient"
      subTitle="my bills & invoices"
      description="View hospital charges, settled invoices, and pending payments."
      allowedRoles={['patient']}
    />
  );
}
