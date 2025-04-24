import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { adminProtectedPage } from '@/lib/page-protection';

const EditUser = async ({ params } : { params: { id: string } }) => {
  // Redirects user to appropriate link if not an admin or not signed in
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const { id } = await params;

  return (
    <main>
      <EditUserForm id={id} />
    </main>
  );
};

export default EditUser;
