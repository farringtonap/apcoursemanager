'use client';

import { useEffect, useState } from 'react';
import { getAllPreRequisites, updatePreRequisite, deletePreRequisite, getAllSubjects } from '@/lib/dbActions';
import { PreRequisite, Subject } from '@prisma/client';
import { Button, Modal, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export default function EditDeletePreRequisites() {
  const [preRequisites, setPreRequisites] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPreReq, setSelectedPreReq] = useState<any>(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [preReqs, subs] = await Promise.all([
      getAllPreRequisites(),
      getAllSubjects(),
    ]);
    setPreRequisites(preReqs);
    setSubjects(subs);
  }

  const handleEditClick = (preReq: any) => {
    setSelectedPreReq(preReq);
    reset({
      id: preReq.id,
      name: preReq.name,
      subjectId: preReq.subject.id,
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this prerequisite?')) {
      await deletePreRequisite(id);
      fetchData();
    }
  };

  const onSubmit = async (data: any) => {
    await updatePreRequisite({
      id: selectedPreReq.id,
      name: data.name,
      subjectId: parseInt(data.subjectId),
      gradeLevel: [], // We are not modifying this in the modal as per your instruction
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
                <Button variant="warning" size="sm" onClick={() => handleEditClick(preReq)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(preReq.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
