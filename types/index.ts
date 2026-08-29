export type UserRole =
  | 'patient'
  | 'receptionist'
  | 'nurse'
  | 'doctor'
  | 'lab_technician'
  | 'pathologist'
  | 'pharmacist'
  | 'billing_officer'
  | 'admin';

export type UserStatus = 'active' | 'suspended' | 'inactive';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  gender?: 'male' | 'female';
  address?: string;
  createdAt: Date;
}
