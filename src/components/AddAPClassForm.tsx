'use client';

/* eslint-disable react/prop-types */

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { createAPClass } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddAPClassSchema } from '@/lib/validationSchemas';
import Select from 'react-select';

interface AddAPClassFormProps {
  preRequisites: { id: number; name: string }[];
}

const AddAPClassForm: React.FC<AddAPClassFormProps> = ({ preRequisites }) => {
  const { status } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddAPClassSchema),
  });

  const onSubmit = async (data: any) => {
    const parsedData = {
      ...data,
      offered: data.offered === 'true',
      gradeLevels: data.gradeLevels || [],
      preRequisiteIds: data.preRequisiteIds || [],
    };

    try {
      await createAPClass(parsedData);
      swal('Success', 'AP Class has been added', 'success', { timer: 2000 });
      reset();
      setTimeout(() => {
        window.location.reload();
      }, 2100);
    } catch (err: any) {
      swal('Error', err.message, 'error');
    }
  };

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') redirect('/auth/signin');

  const gradeLevelOptions = [
    { value: 9, label: '9' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' },
  ];

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

                {/* Pre-Requisites */}
                <Form.Group>
                  <Form.Label>Pre-Requisites</Form.Label>
                  <Select
                    isMulti
                    options={preRequisites.map((pr) => ({ value: pr.id, label: pr.name }))}
                    onChange={(selectedOptions) => {
                      const ids = selectedOptions.map((option) => option.value);
                      setValue('preRequisiteIds', ids);
                    }}
                    className={errors.preRequisiteIds ? 'is-invalid' : ''}
                  />
                  <div className="invalid-feedback d-block">{errors.preRequisiteIds?.message}</div>
                </Form.Group>

                {/* Updated Grade Levels to use react-select */}
                <Form.Group>
                  <Form.Label>Grade Levels</Form.Label>
                  <Select
                    isMulti
                    options={gradeLevelOptions}
                    onChange={(selectedOptions) => {
                      const levels = selectedOptions.map((option) => option.value);
                      setValue('gradeLevels', levels);
                    }}
                    className={errors.gradeLevels ? 'is-invalid' : ''}
                  />
                  <div className="invalid-feedback d-block">{errors.gradeLevels?.message}</div>
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
