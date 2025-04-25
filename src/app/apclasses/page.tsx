/* eslint-disable max-len */
/* eslint-disable @next/next/no-async-client-component */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

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

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return <ClientSideAPClassList classes={classes} />;
}

function ClientSideAPClassList({ classes }: { classes: any[] }) {
  const [query, setQuery] = useState('');

  const filtered = classes.filter(cls => cls.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0 }}>AP Classes</h1>

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
            flexShrink: 0,
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {filtered.map((cls) => (
          <Link
            key={cls.name}
            href={cls.offered ? `/apclasses/${cls.id}` : '#'}
            style={{
              pointerEvents: cls.offered ? 'auto' : 'none',
              textDecoration: 'none',
              width: '300px',
            }}
          >
            <div
              style={{
                border: '1px solid black',
                padding: '20px',
                borderRadius: '10px',
                cursor: cls.offered ? 'pointer' : 'not-allowed',
                backgroundColor: cls.offered ? '#e0ffe0' : '#ffe0e0',
                color: cls.offered ? 'black' : 'gray',
              }}
            >
              <h2>{cls.name.replace('-', ' ').toUpperCase()}</h2>
              <p>
                <strong>Subject:</strong>
                {' '}
                {cls.subject.name}
              </p>
              <p>
                <strong>Description:</strong>
                {' '}
                {cls.description}
              </p>
              <p>
                <strong>Grade Levels:</strong>
                {' '}
                {cls.gradeLevels.map((g: { level: any; }) => g.level).join(', ')}
              </p>
              <p>
                <strong>Prerequisites:</strong>
                {' '}
                {
                cls.prerequisites.length > 0
                  ? cls.prerequisites.map((p: { name: any; }) => p.name).join(', ')
                  : 'None'
              }
              </p>
              {!cls.offered && <em>Not Offered This Year</em>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
