import React from 'react';
import SubPageSkeleton from '@/components/portals/SubPageSkeleton';

export default function BillingInvoicesPage() {
  return (
    <SubPageSkeleton
      role="billing"
      subTitle="invoices registry"
      description="Consolidate charges for consultations, ward lodging, lab tests, and dispensed medicines."
      allowedRoles={['billing_officer']}
    />
  );
}
