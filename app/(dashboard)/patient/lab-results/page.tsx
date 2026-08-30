import React from 'react';
import SubPageSkeleton from '@/components/SubPageSkeleton';

export default function PatientLabResultsPage() {
  return (
    <SubPageSkeleton
      role="patient"
      subTitle="my lab results"
      description="Access and download verified diagnostic reports and lab findings."
      allowedRoles={['patient']}
    />
  );
}
