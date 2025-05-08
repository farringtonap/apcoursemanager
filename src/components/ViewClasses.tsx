'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Table, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import { getAllAPClasses, updateTeacherClassFields } from '@/lib/dbActions';
import swal from 'sweetalert';

interface APClass {
  id: number;
  name: string;
  description: string;
  resources: string | null;
  offered: boolean;
  teacherEmail: string;
  subject: { name: string };
  gradeLevels: { level: number }[];
  prerequisites: { name: string }[];
}

export default function ViewClasses() {
  const { data: session, status } = useSession();
  const [classes, setClasses] = useState<APClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentClass, setCurrentClass] = useState<APClass | null>(null);
  const [description, setDescription] = useState('');
  const [resources, setResources] = useState('');

  useEffect(() => {
    const fetchTeacherClasses = async () => {
      try {
        const allClasses = await getAllAPClasses();
        const teacherEmail = session?.user?.email;
        const teacherClasses = allClasses.filter(
          (cls: APClass) => cls.teacherEmail === teacherEmail,
        );
        setClasses(teacherClasses);
      } catch (err) {
        console.error('Failed to fetch classes:', err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchTeacherClasses();
    }
  }, [session, status]);

  const handleEditClick = (cls: APClass) => {
    setCurrentClass(cls);
    setDescription(cls.description || '');
    setResources(cls.resources || '');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!currentClass) return;

    try {
      await updateTeacherClassFields({
        id: currentClass.id,
        description,
        resources,
      });
      swal('Success', 'Class updated successfully!', 'success', { timer: 2000 });
      setShowModal(false);
      const updatedClasses = classes.map((cls) => (cls.id === currentClass.id
        ? { ...cls, description, resources } : cls));
      setClasses(updatedClasses);
    } catch (err) {
      swal('Error', 'Failed to update class.', 'error');
    }
  };

  if (status === 'loading' || loading) return <Spinner animation="border" />;
  if (classes.length === 0) return <Alert variant="info">You are not assigned to any AP classes.</Alert>;

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Description</th>
            <th>Resource Link</th>
            <th>Offered</th>
            <th>Grade Levels</th>
            <th>Pre-Requisites</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <td>{cls.name}</td>
              <td>{cls.subject.name}</td>
              <td>{cls.description}</td>
              <td>
                {cls.resources ? (
                  <a href={cls.resources} target="_blank" rel="noopener noreferrer">Link</a>
                ) : (
                  'N/A'
                )}
              </td>
              <td>{cls.offered ? 'Yes' : 'No'}</td>
              <td>{cls.gradeLevels.map((g) => g.level).join(', ')}</td>
              <td>
                {cls.prerequisites.length > 0
                  ? cls.prerequisites.map((pr) => pr.name).join(', ')
                  : 'None'}
              </td>
              <td>
                <Button size="sm" variant="secondary" onClick={() => handleEditClick(cls)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Resource Link</Form.Label>
              <Form.Control
                type="url"
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                placeholder="https://example.com/resource"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
