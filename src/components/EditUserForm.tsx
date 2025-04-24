import { User } from '@prisma/client';
import NotFound from '@/app/not-found';
import { prisma } from '@/lib/prisma';

export default async function EditUserForm({ id } : { id:String }) {
  const uid: User | null = await prisma.user.findUnique({ where: { id: Number(id) } });

  if (!uid) {
    return NotFound();
  }

  return (
    <h1>
      This is
      {' '}
      {uid.email}
      {' '}
      {uid.id}
      {' '}
      User
    </h1>
  );
}
