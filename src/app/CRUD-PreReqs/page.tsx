'use client';

import AddPreRequisites from '../../components/AddPreRequisites';
import EditDeletePreRequisites from '../../components/EditDeletePreRequisites';

export default function EditPrerequisitesPage() {
  return (
    <div className="container mt-4 text-white">
      <div style={{ display: 'inline-block' }}>
        <h2
          style={{
            margin: 0,
            padding: '12px 20px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '20px',
            color: '#fff',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)',
            display: 'inline-block',
          }}
        >
          Add/Edit Prerequisites
        </h2>
      </div>
      <AddPreRequisites />
      <hr className="my-4" />
      <EditDeletePreRequisites />
    </div>
  );
}
