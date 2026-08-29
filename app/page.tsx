import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getAuthenticatedUser } from '@/lib/auth';

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const user = await getAuthenticatedUser(token);
  if (!user) {
    redirect('/login');
  }

  // Redirect to role-specific dashboard portal page
  if (user.role === 'patient') {
    redirect('/patient');
  } else if (user.role === 'nurse') {
    redirect('/nurse');
  } else if (user.role === 'receptionist') {
    redirect('/receptionist');
  } else {
    redirect(`/${user.role}`);
  }
}
