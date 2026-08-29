import React from 'react';
import SubPageSkeleton from '@/components/portals/SubPageSkeleton';

export default function LaboratoryOrdersPage() {
  return (
    <SubPageSkeleton
      role="laboratory"
      subTitle="lab orders"
      description="Inspect pending sample requests issued by specialist doctors."
      allowedRoles={['lab_technician']}
    />
  );
}
