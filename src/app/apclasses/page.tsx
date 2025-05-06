import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Row, Col, Card, CardBody, CardText, CardTitle } from 'react-bootstrap';

export default async function APClassesPage() {
  const classes = await prisma.aPClass.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      offered: true,
      subject: { select: { name: true } },
      gradeLevels: { select: { level: true } },
      prerequisites: { select: { name: true } },
    },
  });

  return (
    <div style={{ padding: '20px' }}>
      {/* Title */}
      <div style={
        { display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '20px' }
        }
      >
        <h1
          className="text-white"
          style={{
            margin: 0,
            padding: '12px 20px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Subtle transparency for a modern effect
            borderRadius: '20px', // Large rounded corners for a sleek look
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)', // Subtle shadow for floating effect
          }}
        >
          AP Classes
        </h1>
      </div>

      {/* Cards Display Section */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4" style={{ marginTop: '20px' }}>
        {classes.map((cls) => (
          <Col>
            <Link
              key={cls.name}
              href={cls.offered ? `/apclasses/${cls.id}` : '#'}
              style={{
                pointerEvents: cls.offered ? 'auto' : 'none',
                textDecoration: 'none',
                width: '300px',
              }}
            >
              <Card
                style={{
                  height: '100%',
                  backgroundColor: 'white',
                  color: cls.offered ? 'black' : 'gray',
                  cursor: cls.offered ? 'pointer' : 'not-allowed',
                }}
              >
                <CardBody className="d-flex flex-column">
                  <CardTitle style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {cls.name.replace('-', ' ').toUpperCase()}
                    <span style={{ marginLeft: '10px' }}>
                      {cls.offered ? '✅' : '❌'}
                    </span>
                  </CardTitle>
                  <CardText>
                    <strong>Subject:</strong>
                    {' '}
                    {cls.subject.name}
                  </CardText>
                  <CardText>
                    <strong>Description:</strong>
                    {' '}
                    {cls.description}
                  </CardText>
                  <CardText>
                    <strong>Grade Levels:</strong>
                    {' '}
                    {cls.gradeLevels.map((g: { level: any; }) => g.level).join(', ')}
                  </CardText>
                  <CardText>
                    <strong>Prerequisites:</strong>
                    {' '}
                    {cls.prerequisites && cls.prerequisites.length > 0
                      ? cls.prerequisites.map((p: { name: string }) => p.name).join(', ')
                      : 'None'}
                  </CardText>
                  {!cls.offered && <em>Not Offered This Year</em>}
                </CardBody>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
