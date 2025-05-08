'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPreRequisite, getAllSubjects } from '@/lib/dbActions';
import { Subject } from '@prisma/client';
import swal from 'sweetalert';

export default function AddPreRequisites() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState('');

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
        gradeLevels: [],
      });
      setError('');
      swal('Success', 'Prerequisite added successfully!', 'success', { timer: 2000 });
      reset();
      setTimeout(() => {
        window.location.reload();
      }, 2100);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="mt-4">
      <h4>Add New Prerequisite</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="prerequisiteName" className="form-label">Prerequisite Name</label>
          <input
            id="prerequisiteName"
            {...register('name', { required: true })}
            className="form-control"
            type="text"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="subjectSelect" className="form-label">Subject</label>
          <select
            id="subjectSelect"
            {...register('subject', { required: true })}
            className="form-select"
          >
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
      </form>
    </div>
  );
}
