'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { createAPClass } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddAPClassSchema } from '@/lib/validationSchemas';

const AddAPClassForm: React.FC = () => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddAPClassSchema),
  });

  const onSubmit = async (data: any) => {
    const parsedData = {
      ...data,
      offered: data.offered === 'true',
      gradeLevels: data.gradeLevels.map((level: string) => parseInt(level)),
    };

    try {
      await createAPClass(parsedData);
      swal('Success', 'AP Class has been added', 'success', { timer: 2000 });
      reset();
    } catch (err: any) {
      swal('Error', err.message, 'error');
    }
  };

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') redirect('/auth/signin');

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center">
            <h2>Add AP Class</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Class Name</Form.Label>
                      <input
                        type="text"
                        {...register('name')}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.name?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Offered</Form.Label>
                      <Form.Select {...register('offered')} className={errors.offered ? 'is-invalid' : ''}>
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </Form.Select>
                      <div className="invalid-feedback">{errors.offered?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Teacher Email</Form.Label>
                      <input
                        type="email"
                        {...register('teacherEmail')}
                        className={`form-control ${errors.teacherEmail ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.teacherEmail?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Teacher Name</Form.Label>
                      <input
                        type="text"
                        {...register('teacherName')}
                        className={`form-control ${errors.teacherName ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.teacherName?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group>
                  <Form.Label>Subject Type</Form.Label>
                  <Form.Select {...register('subjectType')} className={errors.subjectType ? 'is-invalid' : ''}>
                    <option value="">Select Subject</option>
                    <option value="Math">Math</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="English">English</option>
                    <option value="Art">Art</option>
                  </Form.Select>
                  <div className="invalid-feedback">{errors.subjectType?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea
                    {...register('description')}
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.description?.message}</div>
                </Form.Group>

                {/* Optional Fields (uncomment when implemented) */}
                {/* <Form.Group>
                  <Form.Label>Resources</Form.Label>
                  <textarea {...register('resources')} className="form-control" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Prerequisites</Form.Label>
                  <textarea {...register('prerequisites')} className="form-control" />
                </Form.Group> */}

                <Form.Group>
                  <Form.Label>Grade Levels</Form.Label>
                  <Form.Select
                    {...register('gradeLevels')}
                    multiple
                    className={errors.gradeLevels ? 'is-invalid' : ''}
                  >
                    <option value={9}>9</option>
                    <option value={10}>10</option>
                    <option value={11}>11</option>
                    <option value={12}>12</option>
                  </Form.Select>
                  <div className="invalid-feedback">{errors.gradeLevels?.message}</div>
                </Form.Group>

                <Form.Group className="form-group pt-3">
                  <Row>
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddAPClassForm;
