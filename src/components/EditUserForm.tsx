'use client';

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
} from 'react-bootstrap';

export default function EditUserForm({ user }: { user: User }) {
  return (
    <Container fluid className="fw-bold justify-content-center align-items-center">
      <Row className="justify-content-center align-items-center">
        <Col xs={5} className="mx-auto bg-white text-black p-4 mt-3 rounded-2">
          <h1 className="h1">Update Account</h1>
          <Form>
            <input type="hidden" value={user.id} />
            <FormGroup>
              <FormLabel htmlFor="first-name">First Name</FormLabel>
              <FormControl
                id="first-Name"
                type="text"
                defaultValue={user.firstName}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="last-name">Last Name</FormLabel>
              <FormControl
                id="last-name"
                type="text"
                defaultValue={user.lastName}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl
                id="password"
                type="password"
                required
                placeholder="Change password here..."
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="role" sm>Role</FormLabel>
              <FormSelect required>
                <option value="TEACHER" selected={user.role === 'TEACHER'}>Teacher</option>
                <option value="ADMIN" selected={user.role === 'ADMIN'}>Admin</option>
              </FormSelect>
            </FormGroup>
            <ButtonGroup className="mt-4">
              <Button href="/admin/" variant="warning">Back</Button>
              <Button variant="primary">Submit</Button>
            </ButtonGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
