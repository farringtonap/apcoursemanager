'use client';

import { useEffect, useState } from 'react';
import { getAllPreRequisites, updatePreRequisite, deletePreRequisite, getAllSubjects } from '@/lib/dbActions';
import { Subject } from '@prisma/client';
import { Button, Modal, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export default function EditDeletePreRequisites() {
  const [preRequisites, setPreRequisites] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPreReq, setSelectedPreReq] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchData = async () => {
    const [preReqs, subs] = await Promise.all([
      getAllPreRequisites(),
      getAllSubjects(),
    ]);
    setPreRequisites(preReqs);
    setSubjects(subs);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (preReq: any) => {
    setSelectedPreReq(preReq);
    reset({
      id: preReq.id,
      name: preReq.name,
      subjectId: preReq.subject.id,
    });
    setShowEditModal(true);
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteConfirmId(id);
    setDeleteConfirmName(name);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId !== null) {
      await deletePreRequisite(deleteConfirmId);
      fetchData();
      setDeleteConfirmId(null);
      setDeleteConfirmName(null);
    }
  };

  const onSubmit = async (data: any) => {
    await updatePreRequisite({
      id: selectedPreReq.id,
      name: data.name,
      subjectId: parseInt(data.subjectId, 10),
      gradeLevel: [],
    });
    setShowEditModal(false);
    fetchData();
  };

  return (
    <div className="mt-5">
      <h4>Edit/Delete Existing Prerequisites</h4>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {preRequisites.map((preReq) => (
            <tr key={preReq.id}>
              <td>{preReq.name}</td>
              <td>{preReq.subject?.name}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEditClick(preReq)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(preReq.id, preReq.name)}
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
          <Modal.Title>Edit Prerequisite</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Prerequisite Name</Form.Label>
              <Form.Control type="text" {...register('name', { required: true })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Select {...register('subjectId', { required: true })}>
                <option value="">-- Select Subject --</option>
                {subjects.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.name}
                  </option>
                ))}
              </Form.Select>
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
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
