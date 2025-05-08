'use client';

import { useEffect, useState } from 'react';
import { Subject } from '@prisma/client';
import { Button, Modal, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { getAllSubjects, updateSubject, deleteSubject } from '@/lib/dbActions';

export default function EditDeleteSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchData = async () => {
    const subs = await getAllSubjects();
    setSubjects(subs);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (subject: Subject) => {
    setSelectedSubject(subject);
    reset({
      id: subject.id,
      name: subject.name,
    });
    setShowEditModal(true);
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteConfirmId(id);
    setDeleteConfirmName(name);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId !== null) {
      try {
        await deleteSubject(deleteConfirmId);
        setDeleteConfirmId(null);
        setDeleteConfirmName(null);
        swal('Deleted!', 'Subject has been deleted.', 'success', { timer: 2000 });
        setTimeout(() => {
          fetchData();
        }, 2100);
      } catch (err) {
        console.error(err);
        swal(
          'Error',
          'Failed to delete subject. Make sure no AP Classes or Prerequisites are associated with it.',
          'error',
        );
      }
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await updateSubject({
        id: selectedSubject?.id ?? 0,
        name: data.name,
      });
      setShowEditModal(false);
      await fetchData();
      swal('Success', 'Subject updated successfully!', 'success', { timer: 2000 });
    } catch (err) {
      console.error(err);
      swal('Error', 'Failed to update subject.', 'error');
    }
  };

  return (
    <div className="mt-5">
      <h4 className="text-white">Edit/Delete Existing Subjects</h4>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id}>
              <td>{subject.name}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEditClick(subject)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(subject.id, subject.name)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Subject</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                {...register('name', {
                  required: true,
                  validate: value => value.trim().length > 0 || 'Name cannot be empty',
                })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteConfirmId !== null} onHide={() => setDeleteConfirmId(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete
          {' '}
          <strong>{deleteConfirmName}</strong>
          ? This will fail if there are any associated AP Classes or Prerequisites.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
