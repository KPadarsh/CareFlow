import React from 'react';
import SubPageSkeleton from '@/components/portals/SubPageSkeleton';

export default function DoctorAppointmentsPage() {
  return (
    <SubPageSkeleton
      role="doctor"
      subTitle="my appointments"
      description="View incoming consultations list and scheduled time slots."
      allowedRoles={['doctor']}
    />
  );
}
