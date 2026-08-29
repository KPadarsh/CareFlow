import React from 'react';
import SubPageSkeleton from '@/components/portals/SubPageSkeleton';

export default function PathologistVerificationPage() {
  return (
    <SubPageSkeleton
      role="pathologist"
      subTitle="sign-off reports"
      description="Verify quantitative and qualitative test values before digital signature authorization."
      allowedRoles={['pathologist']}
    />
  );
}
