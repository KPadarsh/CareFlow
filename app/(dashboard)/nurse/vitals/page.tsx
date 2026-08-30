import React from 'react';
import SubPageSkeleton from '@/components/SubPageSkeleton';

export default function NurseVitalsPage() {
  return (
    <SubPageSkeleton
      role="nurse"
      subTitle="log patient vitals"
      description="Record or update patient triage metrics including Blood Pressure, Pulse, SPO2, and Temperature."
      allowedRoles={['nurse']}
    />
  );
}
