'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { redirect } from 'next/navigation';
import { EditUserSchema } from '@/lib/validationSchemas';
import { User } from '@prisma/client';
import {
  Container,
  Form,
  FormControl,
  Row,
  FormSelect,
  FormLabel,
  FormGroup,
  Button,
  Col,
  ButtonGroup,
  Alert,
} from 'react-bootstrap';
import { updateUser, updateAuthorizedUser, deleteUser, deleteAuthorizedUser } from '@/lib/dbActions';
import swal from 'sweetalert';
import LoadingSpinner from './LoadingSpinner';

export default function EditUserForm({ user }: { user: User }) {
  const [isError, setIsError] = useState<Error | undefined>();
  const { status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditUserSchema),
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const onSubmit = async (data:
  { id: number,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string; }) => {
    try {
      await updateUser(data);
      await updateAuthorizedUser(data);
      swal('Success', 'Account successfully edited', 'sucess', {
        timer: 2000,
      });
      setIsError(undefined);
    } catch (err) {
      setIsError(err as Error);
    }
  };

  const handleDelete = async (id:number) => {
    const confirmed = await swal({
      title: `Are you sure you want to delete ${user.firstName} ${user.lastName}'s account?`,
      text: 'Before this, you will need to unassign this user from any AP Classes. This action cannot be undone',
      icon: 'warning',
      buttons: ['No', 'Yes'],
      dangerMode: true,
    });

    if (confirmed) {
      try {
        await deleteUser(id);
        await deleteAuthorizedUser(user.email);
        swal('Deleted!', 'The account has been removed', 'success');
      } catch(err) {
        swal('Error', 'Failed to delete account', 'error');
      }
    }
  }

  return (
    <Container fluid className="fw-bold justify-content-center align-items-center">
      <Row className="justify-content-center align-items-center">
        <Col xs={5} className="mx-auto bg-white text-black p-4 mt-3 rounded-2">
          <h1 className="h1">Update Account</h1>
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
            <input
              type="hidden"
              value={user.id}
              {...register('id')}
            />
            <FormGroup>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl
                id="email"
                type="email"
                readOnly
                value={user.email}
                required
                {...register('email')}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="first-name">First Name</FormLabel>
              <FormControl
                id="first-Name"
                type="text"
                defaultValue={user.firstName}
                required
                className={`${errors.firstName ? 'is-invalid' : ''}`}
                {...register('firstName')}
              />
              <div className="invalid-feedback">{errors.firstName?.message}</div>
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="last-name">Last Name</FormLabel>
              <FormControl
                id="last-name"
                type="text"
                defaultValue={user.lastName}
                required
                className={`${errors.lastName ? 'is-invalid' : ''}`}
                {...register('lastName')}
              />
              <div className="invalid-feedback">{errors.lastName?.message}</div>
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl
                id="password"
                type="password"
                defaultValue={user.password}
                placeholder="Change password here..."
                className={`${errors.password ? 'is-invalid' : ''}`}
                {...register('password')}
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="role" sm>Role</FormLabel>
              <FormSelect
                defaultValue={user.role}
                required
                className={`${errors.role ? 'is-invalid' : ''}`}
                {...register('role')}
              >
                <option value="TEACHER" selected={user.role === 'TEACHER'}>Teacher</option>
                <option value="ADMIN" selected={user.role === 'ADMIN'}>Admin</option>
              </FormSelect>
              <div className="invalid-feedback">{errors.role?.message}</div>
            </FormGroup>
            <ButtonGroup className="mt-4">
              <Button href="/admin/" variant="warning">Back</Button>
              <Button type="submit" variant="primary">Submit</Button>
              <Button type="button" variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
            </ButtonGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
