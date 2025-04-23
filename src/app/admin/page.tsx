import { getServerSession } from 'next-auth';
import
{ Container,
  Button,
  Row,
  Col } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { PencilSquare, PlusCircle, XSquare } from 'react-bootstrap-icons';

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );
  const users = await prisma.user.findMany({});
  return (
    <main className="mx-auto">
      <Container id="list" className="py-3">
        <Button
          href="/"
          variant="success"
          className="p-2 text-white fw-medium d-flex justify-content-center align-items-center gap-2 mb-4"
        >
          <PlusCircle size={20} />
          Add Member
        </Button>
        <Row lg={3} className="g-5">
          {users.map((user) => (
            <Col sm key={user.email} className="mb-2">
              <hgroup>
                <p
                  className="text-capitalize px-2 bg-danger text-white small rounded-pill"
                  style={{ width: 'fit-content' }}
                >
                  {`${user.role.toLowerCase()}`}
                </p>
                <h3 className="h3 text-black fw-bold lh-1">{`${user.firstName} ${user.lastName}`}</h3>
                <p className="small text-muted">
                  {`${user.email}`}
                </p>
              </hgroup>
              <div className="d-flex flex-row gap-2">
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
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
