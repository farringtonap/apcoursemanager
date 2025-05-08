'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { createSubject } from '@/lib/dbActions';

export default function AddSubject() {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async (data: any) => {
    try {
      await createSubject({
        name: data.name,
      });
      setError('');
      swal('Success', 'Subject added successfully!', 'success', { timer: 2000 });
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
      <h4 className="text-white">Add New Subject</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="subjectName" className="form-label text-white">
            Subject Name
            <input
              id="subjectName"
              {...register('name', { required: true })}
              className="form-control"
              type="text"
            />
          </label>
        </div>

        <button type="submit" className="btn btn-primary">Add Subject</button>

        {error && <div className="text-danger mt-2">{error}</div>}
      </form>
    </div>
  );
}
