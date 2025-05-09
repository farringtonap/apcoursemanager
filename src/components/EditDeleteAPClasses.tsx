'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import swal from 'sweetalert';
import {
  getAllAPClasses,
  deleteAPClass,
  updateAPClass,
  getAllSubjects,
  getAllPreRequisites,
} from '@/lib/dbActions';

interface APClass {
  id: number;
  name: string;
  description: string;
  resources: string | null;
  offered: boolean;
  subjectId: number;
  subject: { name: string };
  teacherEmail: string;
  teacher?: { firstName: string; lastName: string };
  gradeLevels: { id: number; level: number }[];
  prerequisites: { id: number; name: string }[];
}

const EditDeleteAPClasses: React.FC = () => {
  const [classes, setClasses] = useState<APClass[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentClass, setCurrentClass] = useState<APClass | null>(null);

  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [allPreRequisites, setAllPreRequisites] = useState<{ id: number; name: string }[]>([]);
  const [selectedPreRequisites, setSelectedPreRequisites] = useState<{ value: number; label: string }[]>([]);
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<{ value: number; label: string }[]>([]);

  const fetchClasses = async () => {
    try {
      const data = await getAllAPClasses();
      setClasses(data);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    }
  };

  const fetchPreRequisites = async () => {
    try {
      const data = await getAllPreRequisites();
      setAllPreRequisites(data);
    } catch (err) {
      console.error('Failed to fetch prerequisites:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    fetchPreRequisites();
  }, []);

  useEffect(() => {
    if (currentClass) {
      setSelectedPreRequisites(
        currentClass.prerequisites.map((pr) => ({
          value: pr.id,
          label: pr.name,
        })),
      );
      setSelectedGradeLevels(
        currentClass.gradeLevels.map((gl) => ({
          value: gl.id,
          label: gl.level.toString(),
        })),
      );
    }
  }, [currentClass]);

  const handleEdit = (cls: APClass) => {
    setCurrentClass(cls);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentClass(null);
  };

  const handleDelete = async (id: number, className: string) => {
    const confirmed = await swal({
      title: `Are you sure you want to delete "${className}"?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      buttons: ['No', 'Yes'],
      dangerMode: true,
    });

    if (confirmed) {
      try {
        await deleteAPClass(id);
        await fetchClasses();
        swal('Deleted!', 'The class has been removed.', 'success');
      } catch (err) {
        swal('Error', 'Failed to delete class.', 'error');
      }
    }
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    if (!currentClass) return;

    try {
      const formData = new FormData(e.target);

      const updated = {
        id: currentClass.id,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        resources: currentClass.resources ?? null,
        offered: formData.get('offered') === 'true',
        subjectId: parseInt(formData.get('subjectId') as string, 10),
        teacherEmail: formData.get('teacherEmail') as string,
        gradeLevel: selectedGradeLevels.map((gl) => ({ id: gl.value })),
        preRequisiteIds: selectedPreRequisites.map((pr) => pr.value),
      };

      await updateAPClass(updated);
      await fetchClasses();
      handleModalClose();
      swal('Success', 'AP Class has been updated', 'success');
    } catch (err) {
      console.error(err);
      swal('Error', 'Failed to update class.', 'error');
    }
  };

  return (
    <div className="mt-5">
      <h3 className="text-center">Manage Existing AP Classes</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Teacher Name</th>
            <th>Teacher Email</th>
            <th>Grade Levels</th>
            <th>Offered</th>
            <th>Pre-Requisites</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center">
                No classes found.
              </td>
            </tr>
          ) : (
            classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.name}</td>
                <td>{cls.subject?.name || 'Unknown'}</td>
                <td>
                  {cls.teacher?.firstName}
                  {cls.teacher?.lastName}
                </td>
                <td>{cls.teacherEmail}</td>
                <td>{cls.gradeLevels?.map((g) => g.level).join(', ') || 'N/A'}</td>
                <td>{cls.offered ? 'Offered' : 'Not Offered'}</td>
                <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {cls.prerequisites?.length
                    ? cls.prerequisites.map((pr) => pr.name).join(', ')
                    : 'None'}
                </td>
                <td>{cls.description}</td>
                <td>
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(cls)} className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(cls.id, cls.name)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* EDIT MODAL */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Form onSubmit={handleEditSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit AP Class</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentClass && (
              <>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Class Name</Form.Label>
                      <Form.Control name="name" defaultValue={currentClass.name} required />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Offered</Form.Label>
                      <Form.Select name="offered" defaultValue={currentClass.offered ? 'true' : 'false'}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Teacher Email</Form.Label>
                      <Form.Control
                        name="teacherEmail"
                        type="email"
                        defaultValue={currentClass.teacherEmail}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Subject</Form.Label>
                      <Form.Select name="subjectId" defaultValue={currentClass.subjectId}>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    defaultValue={currentClass.description}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Grade Levels</Form.Label>
                  <Select
                    isMulti
                    options={[
                      { value: 1, label: '9' },
                      { value: 2, label: '10' },
                      { value: 3, label: '11' },
                      { value: 4, label: '12' },
                    ]}
                    value={selectedGradeLevels}
                    onChange={(options) => setSelectedGradeLevels(options as any)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Pre-Requisites</Form.Label>
                  <Select
                    isMulti
                    options={allPreRequisites.map((pr) => ({ value: pr.id, label: pr.name }))}
                    value={selectedPreRequisites}
                    onChange={(options) => setSelectedPreRequisites(options as any)}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default EditDeleteAPClasses;
