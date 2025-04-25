import { notFound } from 'next/navigation';
import { PrismaClient } from '@/lib/prisma';

const prisma = new PrismaClient();

type Props = {
  params: {
    name: string;
  };
};

export default async function APClassDetailPage({ params }: Props) {
  const classItem = await prisma.aPClass.findFirst({
    where: {
      name: params.name,
    },
    select: {
      name: true,
      description: true,
      resources: true,
      subject: {
        select: { name: true },
      },
      teacher: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      prerequisites: {
        select: { name: true },
      },
      gradeLevels: {
        select: { level: true },
      },
    },
  });

  if (!classItem) return notFound();

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto' }}>
      <h1>{classItem.name.replace('-', ' ').toUpperCase()}</h1>
      <p>
        <strong>Description:</strong>
        {' '}
        {classItem.description}
      </p>
      {classItem.resources && (
        <p>
          <strong>Resources:</strong>
          {' '}
          {classItem.resources}
        </p>
      )}
      <p>
        <strong>Subject:</strong>
        {' '}
        {classItem.subject.name}
      </p>
      <p>
        <strong>Teacher:</strong>
        {' '}
        {classItem.teacher.firstName}
        {' '}
        {classItem.teacher.lastName}
      </p>
      <p>
        <strong>Contact:</strong>
        {' '}
        <a href={`mailto:${classItem.teacher.email}`}>{classItem.teacher.email}</a>
      </p>
      <p>
        <strong>Grade Levels:</strong>
        {' '}
        {classItem.gradeLevels.map(g => g.level).join(', ')}
      </p>
      <p>
        <strong>Prerequisites:</strong>
        {' '}
        {
        classItem.prerequisites.length > 0
          ? classItem.prerequisites.map(p => p.name).join(', ')
          : 'None'
      }
      </p>
    </div>
  );
}
