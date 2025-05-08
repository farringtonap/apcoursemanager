'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getAllPreRequisites } from '@/lib/dbActions';
import AddAPClassForm from '../../components/AddAPClassForm';
import EditDeleteAPClasses from '../../components/EditDeleteAPClasses';

const EditClassPage = () => {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<string | null>(null);
  const [preRequisites, setPreRequisites] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (session?.user) {
      const user = session.user as { email: string; randomKey: string };
      setRole(user.randomKey);
    }

    // Fetch from DB (not API!)
    const load = async () => {
      const preReqs = await getAllPreRequisites(); // this is a DB function
      setPreRequisites(preReqs.map(pr => ({ id: pr.id, name: pr.name })));
    };
    load();
  }, [session]);

  if (status === 'loading') return <LoadingSpinner />;
  if (!session) redirect('/auth/signin');
  if (role !== 'ADMIN') return <div>You are not authorized to access this page.</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Add / Edit AP Courses</h1>
      <p>Welcome Admin. You can add, edit, and delete all AP classes here.</p>

      {/* Pass preRequisites directly to form */}
      <AddAPClassForm preRequisites={preRequisites} />

      <EditDeleteAPClasses />
    </div>
  );
};

export default EditClassPage;
