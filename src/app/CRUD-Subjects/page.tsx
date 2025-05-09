'use client';

import AddSubjects from '../../components/AddSubjects';
import EditDeleteSubjects from '../../components/EditDeleteSubjects';

export default function EditPrerequisitesPage() {
  return (
    <div className="container-lg mt-4">
      <h2
        className="text-white"
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
        Add/Edit Subjects
      </h2>
      <AddSubjects />
      <hr className="my-4" />
      <EditDeleteSubjects />
    </div>
  );
}
