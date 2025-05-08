'use client';

import AddPreRequisites from '../../components/AddPreRequisites';
import EditDeletePreRequisites from '../../components/EditDeletePreRequisites';

export default function EditPrerequisitesPage() {
  return (
    <div className="container mt-4">
      <h2>Add/Edit Prerequisites</h2>
      <AddPreRequisites />
      <hr className="my-4" />
      <EditDeletePreRequisites />
    </div>
  );
}
