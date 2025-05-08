import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { adminProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import EditUserForm from '@/components/EditUserForm';
import NotFound from '@/app/not-found';

const EditUser = async ({ params } : { params: { id: string } }) => {
  // Redirects user to appropriate link if not an admin or not signed in
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const id = Number(await params.id);
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return NotFound();
  }
  return (
    <main>
      <EditUserForm user={user} />
    </main>
  );
};

export default EditUser;
