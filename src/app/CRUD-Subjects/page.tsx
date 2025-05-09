'use client';

import AddSubjects from '../../components/AddSubjects';
import EditDeleteSubjects from '../../components/EditDeleteSubjects';

export default function EditPrerequisitesPage() {
  return (
    <div className="container mt-4">
      <h2 className="text-white">Add/Edit Subjects</h2>
      <AddSubjects />
      <hr className="my-4 text-white" />
      <EditDeleteSubjects />
    </div>
  );
}
