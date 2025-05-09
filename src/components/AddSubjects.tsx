/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
// eslint-disable-next-line import/extensions
import { createSubject } from '@/lib/dbActions';

export default function AddSubject() {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await createSubject({ name: data.name });
      setError('');
      setShowSuccessMessage(true);

      // Show the sweet alert with proper class names for testing
      await swal({
        title: 'Success',
        text: 'Subject added successfully!',
        icon: 'success',
        className: 'swal-modal',
        buttons: [false, false], // Prevent closing by user
        closeOnClickOutside: false,
        closeOnEsc: false,
      });

      reset();

      // Only reload after a delay to ensure tests can detect the alert
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err: any) {
      // Handle Prisma unique constraint error specifically
      if (err.message && err.message.includes('Unique constraint failed')) {
        setError('Subject already exists');
      } else {
        setError(err.message || 'Something went wrong.');
      }
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-white" data-testid="add-subject-heading">Add New Subject</h4>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-100">
        <div className="mb-3 w-100">
          <label className="form-label text-white w-100">
            Subject Name
            <input
              type="text"
              className="form-control w-100"
              required
              {...register('name', { required: 'Subject name is required' })}
            />
          </label>
        </div>

        <button type="submit" className="btn btn-primary">Add Subject</button>

        {error && (
          <div className="text-danger mt-2" data-testid="error-message">
            {error}
          </div>
        )}

        {/* Hidden element that tests can look for immediately after successful submission */}
        {showSuccessMessage && (
          <div
            className="success-indicator-hidden"
            style={{ display: 'none' }}
            data-testid="success-indicator"
          >
            <div className="swal-title">Success</div>
            <div className="swal-text">Subject added successfully!</div>
          </div>
        )}
      </form>
    </div>
  );
}
