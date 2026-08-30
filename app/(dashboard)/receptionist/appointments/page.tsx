import React from 'react';
import SubPageSkeleton from '@/components/SubPageSkeleton';

export default function ReceptionistAppointmentsPage() {
  return (
    <SubPageSkeleton
      role="receptionist"
      subTitle="appointment scheduler"
      description="Book, reschedule, or cancel patient sessions with active specialist doctors."
      allowedRoles={['receptionist']}
    />
  );
}
