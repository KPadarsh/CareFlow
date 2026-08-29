import React from 'react';
import SubPageSkeleton from '@/components/portals/SubPageSkeleton';

export default function BillingPaymentsPage() {
  return (
    <SubPageSkeleton
      role="billing"
      subTitle="process payments"
      description="Record card, cash, UPI, and insurance claim settlement operations."
      allowedRoles={['billing_officer']}
    />
  );
}
