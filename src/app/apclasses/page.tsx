import { PrismaClient } from '@/lib/prisma';

const prisma = new PrismaClient();

export default async function APClassesPage() {
  const classes = await prisma.aPClass.findMany({
    select: {
      name: true,
      description: true,
      offered: true,
      subject: {
        select: { name: true },
      },
      gradeLevels: {
        select: { level: true },
      },
      prerequisites: {
        select: { name: true },
      },
    },
  });

  return (
    <div>
      <h1>AP Classes</h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {classes.map((cls) => (
          <a
            key={cls.name}
            href={cls.offered ? `/apclasses/${cls.name}` : '#'}
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
              <h2 style={{ margin: '0 0 10px 0' }}>
                {cls.name.replace('-', ' ').toUpperCase()}
              </h2>
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
                {cls.gradeLevels.map(g => g.level).join(', ')}
              </p>
              <p>
                <strong>Prerequisites:</strong>
                {' '}
                {
                cls.prerequisites.length > 0
                  ? cls.prerequisites.map(p => p.name).join(', ')
                  : 'None'
              }
              </p>
              {!cls.offered && <em>Not Offered This Year</em>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
