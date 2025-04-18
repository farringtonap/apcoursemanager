import { getServerSession } from 'next-auth';
import
{ Card,
  Container,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Row,
  Col,
  CardFooter,
  CardText } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { PencilSquare, XSquare } from 'react-bootstrap-icons';

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );
  const users = await prisma.user.findMany({});

  return (
    <main>
      <Container id="list" className="py-3 mx-auto">
        <Row lg={3} className="g-4">
          {users.map((user) => (
            <Col sm key={user.email}>
              <Card>
                <CardBody>
                  <CardTitle className="h3 fw-bold">{`${user.firstName} ${user.lastName}`}</CardTitle>
                  <CardSubtitle className="small text-muted mb-4">{user.email}</CardSubtitle>
                  <CardText />
                  <CardFooter className="d-flex flex-row justify-content-start align-items-center ps-0 gap-2">
                    <Button
                      variant="outline-primary"
                      href="/"
                      size="sm"
                      className="d-flex justify-content-center align-items-center gap-1 fw-medium"
                    >
                      <PencilSquare />
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      href="/"
                      size="sm"
                      className="d-flex justify-content-center align-items-center gap-1 fw-medium"
                    >
                      <XSquare />
                      Delete
                    </Button>
                  </CardFooter>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
