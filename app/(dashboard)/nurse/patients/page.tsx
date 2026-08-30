import React from 'react';
import SubPageSkeleton from '@/components/SubPageSkeleton';

export default function NursePatientsPage() {
  return (
    <SubPageSkeleton
      role="nurse"
      subTitle="assigned patients"
      description="Access patients currently admitted to your ward or active clinic queues."
      allowedRoles={['nurse']}
    />
  );
}
