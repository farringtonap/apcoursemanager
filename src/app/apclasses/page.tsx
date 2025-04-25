const classes = ['ap-biology', 'ap-chemistry', 'ap-physics'];

export default function APClassesPage() {
  return (
    <div>
      <h1>AP Classes</h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {classes.map((classname) => (
          <a key={classname} href={`/apclasses/${classname}`}>
            <div style={{ border: '1px solid black', padding: '20px', cursor: 'pointer' }}>
              {classname.replace('-', ' ').toUpperCase()}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
