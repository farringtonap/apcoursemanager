import { getServerSession } from 'next-auth';
import { adminProtectedPage } from '@/lib/page-protection';
import { AddAuthorizedUserForm } from '@/components/AddAuthorizedUserForm';
import authOptions from '@/lib/authOptions';

const AddUserPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );
  return (
    <main>
      <AddAuthorizedUserForm />
    </main>
  );
};

export default AddUserPage;
