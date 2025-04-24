'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import AddAPClassForm from './AddAPClassForm';
import EditDeleteAPClasses from './EditDeleteAPClasses';

const EditClassPage = () => {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      const user = session.user as { email: string; randomKey: string };
      setRole(user.randomKey);
    }
  }, [session]);

  if (status === 'loading') return <LoadingSpinner />;
  if (!session) redirect('/auth/signin');
  if (role !== 'ADMIN') return <div>You are not authorized to access this page.</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Add / Edit AP Courses</h1>
      <p>Welcome Admin. You can add, edit, and delete all AP classes here.</p>

      {/* Add New AP Class */}
      <AddAPClassForm />

      {/* View/Edit/Delete AP Classes */}
      <EditDeleteAPClasses />
    </div>
  );
};

export default EditClassPage;
