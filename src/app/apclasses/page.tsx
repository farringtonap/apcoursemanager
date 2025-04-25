/* eslint-disable max-len */
/* eslint-disable @next/next/no-async-client-component */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Row, Col, Card } from 'react-bootstrap';

export default async function APClassesPage() {
  const classes = await prisma.aPClass.findMany({
    select: {
      name: true,
      description: true,
      offered: true,
      subject: { select: { name: true } },
      gradeLevels: { select: { level: true } },
      prerequisites: { select: { name: true } },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return <ClientSideAPClassList classes={classes} />;
}

function ClientSideAPClassList({ classes }: { classes: any[] }) {
  const [query, setQuery] = useState('');

  const filtered = classes.filter(cls => cls.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ padding: '20px' }}>
      {/* Title and Search Bar Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <h1
          className="text-white"
          style={{
            margin: 0,
            padding: '12px 20px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Subtle transparency for a modern effect
            borderRadius: '20px', // Large rounded corners for a sleek look
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)', // Subtle shadow for floating effect
          }}
        >
          AP Classes
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <input
            type="text"
            placeholder="Search by class name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: '10px',
              width: '100%',
              maxWidth: '400px',
              fontSize: '16px',
            }}
          />
        </div>
      </div>

      {/* Cards Display Section */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4" style={{ marginTop: '20px' }}>
        {filtered.map((cls) => (
          <Col key={cls.name}>
            <Link
              href={cls.offered ? `/apclasses/${cls.name}` : '#'}
              style={{
                textDecoration: 'none',
                pointerEvents: cls.offered ? 'auto' : 'none',
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
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {cls.name.replace('-', ' ').toUpperCase()}
                    <span style={{ marginLeft: '10px' }}>
                      {cls.offered ? '✅' : '❌'}
                    </span>
                  </Card.Title>
                  <Card.Text>
                    <strong>Subject:</strong>
                    {' '}
                    {cls.subject.name}
                  </Card.Text>
                  <Card.Text>
                    <strong>Description:</strong>
                    {' '}
                    {cls.description}
                  </Card.Text>
                  <Card.Text>
                    <strong>Grade Levels:</strong>
                    {' '}
                    {cls.gradeLevels.map((g: { level: any; }) => g.level).join(', ')}
                  </Card.Text>
                  <Card.Text>
                    <strong>Prerequisites:</strong>
                    {' '}
                    {cls.prerequisites.length > 0 ? cls.prerequisites.map((p: { name: any; }) => p.name).join(', ') : 'None'}
                  </Card.Text>
                  {!cls.offered && <em>Not Offered This Year</em>}
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>

  );
}
