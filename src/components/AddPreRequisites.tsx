'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPreRequisite, getAllSubjects } from '@/lib/dbActions';
import { Subject } from '@prisma/client';

export default function AddPreRequisites() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchSubjects() {
      const data = await getAllSubjects();
      setSubjects(data);
    }
    fetchSubjects();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await createPreRequisite({
        name: data.name,
        subject: data.subject,
        gradeLevels: [], // Placeholder - may be used later
      });
      setSuccess('Prerequisite added successfully.');
      setError('');
      reset();
      window.location.reload(); // Reload the page to see the new prerequisite
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
      setSuccess('');
    }
  };

  return (
    <div className="mt-4">
      <h4>Add New Prerequisite</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Prerequisite Name</label>
          <input
            type="text"
            className="form-control"
            {...register('name', { required: true })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Subject</label>
          <select className="form-select" {...register('subject', { required: true })}>
            <option value="">-- Select a Subject --</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add Prerequisite</button>

        {error && <div className="text-danger mt-2">{error}</div>}
        {success && <div className="text-success mt-2">{success}</div>}
      </form>
    </div>
  );
}
