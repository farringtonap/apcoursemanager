'use client';

import { useParams } from 'next/navigation';

export default function APClassPage() {
  const params = useParams();
  const classname = params.class as string;

  return (
    <div>
      <h1>{classname.replace('-', ' ').toUpperCase()}</h1>
      <p>
        This is the page for
        {classname.replace('-', ' ')}
        .
      </p>
    </div>
  );
}
