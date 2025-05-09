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
    <div className="text-white" style={{ padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{
          display: 'inline-block',
          margin: 0,
          padding: '12px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '20px',
          color: '#fff',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)',
        }}
        >
          Add / Edit AP Courses
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <p
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)', // very slightly more opaque
            padding: '10px 15px',
            borderRadius: '8px',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)', // stronger shadow for more pop
            margin: 0,
          }}
        >
          <strong>Welcome Admin. You can add, edit, and delete all AP classes here.</strong>
        </p>
      </div>

      {/* Pass preRequisites directly to form */}
      <AddAPClassForm preRequisites={preRequisites} />

      <EditDeleteAPClasses />
    </div>
  );
};

export default EditClassPage;
