import React from 'react';
import SubPageSkeleton from '@/components/portals/SubPageSkeleton';

export default function LaboratoryResultsPage() {
  return (
    <SubPageSkeleton
      role="laboratory"
      subTitle="input test results"
      description="Record quantitative findings and attach reports to patients clinical history."
      allowedRoles={['lab_technician']}
    />
  );
}
