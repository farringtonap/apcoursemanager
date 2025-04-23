const EditUser = async ({ params } : { params: { id: string } }) => {
  const { id } = await params;

  return (
    <h1>
      This is user
      {' '}
      {id}
    </h1>
  );
};

export default EditUser;
