import React from 'react';
import SubPageSkeleton from '@/components/portals/SubPageSkeleton';

export default function DoctorConsultationsPage() {
  return (
    <SubPageSkeleton
      role="doctor"
      subTitle="consultations log"
      description="Record diagnosis notes, medical history, and clinical comments."
      allowedRoles={['doctor']}
    />
  );
}
