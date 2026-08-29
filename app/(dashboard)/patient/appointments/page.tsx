import React from 'react';
import SubPageSkeleton from '@/components/portals/SubPageSkeleton';

export default function PatientAppointmentsPage() {
  return (
    <SubPageSkeleton
      role="patient"
      subTitle="my appointments"
      description="Book a consultation slot with specialist physicians or view scheduled sessions."
      allowedRoles={['patient']}
    />
  );
}
