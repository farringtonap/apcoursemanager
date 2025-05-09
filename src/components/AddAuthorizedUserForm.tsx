'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { redirect } from 'next/navigation';
import { createAuthorizedUser } from '@/lib/dbActions';
import { AddAuthorizedUserSchema } from '@/lib/validationSchemas';
import LoadingSpinner from '@/components/LoadingSpinner';
import swal from 'sweetalert';

const AddAuthorizedUserForm : React.FC = () => {
  // Checks to see if there is an error when calling onSubmit
  const [isError, setIsError] = useState<Error>();
  const onSubmit = async (data: { email: string, role: string }) => {
    try {
      await createAuthorizedUser(data);
      swal('Success', `${data.email} has been successfully added`, 'success', {
        timer: 2000,
      });
      // Reset this to prevent error from persisting after successfull creation
      setIsError(undefined);
    } catch (err) {
      // This checks if internal error occurs, which seems to occur if it is an already existing email
      if ((err as unknown as Error).message.includes('Classes or null prototypes are not supported')) {
        setIsError(new Error('Email already exists!'));
      } else {
        setIsError(err as Error);
      }
    }
  };

  const { status } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddAuthorizedUserSchema),
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container fluid className="py-3 align-items-center">
      <Row className="justify-content-center align-items-center">
        <Col xs={5}>
          <Card>
            <Card.Header>
              <hgroup>
                <h1 className="h1 text-black">Add Authorized User</h1>
                <p className="small text-muted">
                  Add the email of the person you wish to be able to manage the site and/or their
                  selected AP Class. Once added, the user will be able to sign up for an account on the site.
                </p>
              </hgroup>
            </Card.Header>
            <Card.Body>
              {
                // This checks for errors with the database action
                isError
                && (
                  <Alert variant="danger">
                    {isError.message}
                  </Alert>
                )
              }
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>
                    Email
                  </Form.Label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="email@example.com"
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>
                    Role
                  </Form.Label>
                  <select
                    {...register('role')}
                    className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                  >
                    <option value="TEACHER" selected>
                      Teacher
                    </option>
                    <option value="ADMIN">
                      Admin
                    </option>
                  </select>
                </Form.Group>
                <Form.Group>
                  <Row className="pt-4">
                    <Col xs="auto">
                      <Button type="submit" variant="primary">
                        Add
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <Button type="button" variant="warning" onClick={() => reset()}>
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

export default AddAuthorizedUserForm;
