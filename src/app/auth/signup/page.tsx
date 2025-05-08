'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Card,
  Col,
  Container,
  Button,
  Form,
  Row,
  Alert,
} from 'react-bootstrap';
import { createUser } from '@/lib/dbActions';

type SignUpForm = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};

/** The sign up page. */
const SignUp = () => {
  const [isError, setIsError] = useState<Error | undefined>();
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    try {
      await createUser(data);
      await signIn('credentials', {callbackUrl: '/', ...data});
      setIsError(undefined);
    } catch (err) {
      if ((err as unknown as Error).message.includes('Classes or null prototypes are not supported')){
        setIsError(new Error('You are not an authorized user. Please contact a site admin if you believe this is a mistake'));
      } else {
        setIsError(err as Error);
      }
    }
  };

  return (
    <main>
      <Container>
        <Row className="justify-content-center">
          <Col xs={5}>
            <h1 className="text-center text-white">Sign Up</h1>
            <Card>
              <Card.Body>
                {isError && <Alert variant="danger">{isError.message}</Alert>}
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="form-group">
                    <Form.Label>Email</Form.Label>
                    <input
                      type="text"
                      {...register('email')}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">
                      {errors.email?.message}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <input
                      type="text"
                      {...register('firstName')}
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">
                      {errors.firstName?.message}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">
                      {errors.lastName?.message}
                    </div>
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Password</Form.Label>
                    <input
                      type="password"
                      {...register('password')}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">
                      {errors.password?.message}
                    </div>
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Confirm Password</Form.Label>
                    <input
                      type="password"
                      {...register('confirmPassword')}
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">
                      {errors.confirmPassword?.message}
                    </div>
                  </Form.Group>
                  <Form.Group className="form-group py-3">
                    <Row>
                      <Col>
                        <Button type="submit" className="btn btn-primary">
                          Register
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          type="button"
                          onClick={() => reset()}
                          className="btn btn-warning float-right"
                        >
                          Reset
                        </Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form>
              </Card.Body>
              <Card.Footer>
                Already have an account?
                <a href="/auth/signin">Sign in</a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignUp;
