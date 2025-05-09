'use client';

import { useState, FormEvent } from 'react';
import { Card, Form } from 'react-bootstrap';

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';

export default function RecommendationFormPage() {
  // form fields
  const [interestsText, setInterestsText] = useState('');
  const [coursesText, setCoursesText] = useState('');
  const [GPA, setGPA] = useState('');
  const [gradeLevel, setGradeLevel] = useState('11');

  // UI states
  const [loading, setLoading] = useState(false);
  const [savedProfile, setSavedProfile] = useState<{
    id: number;
    createdAt: string;
  } | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState('');

  /* eslint-disable-next-line consistent-return */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setRecommendations([]);
    setSavedProfile(null);

    // 1) parse
    const interests = interestsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const previousCourses = coursesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const gpaNum = parseFloat(GPA);
    const gradeNum = parseInt(gradeLevel, 10);

    // 2) validate
    if (!interests.length) {
      setError('Please enter at least one interest.');
      return;
    }
    if (Number.isNaN(gpaNum)) {
      setError('Please enter a valid GPA.');
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch('/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests,
          previousCourses,
          GPA: gpaNum,
          gradeLevel: gradeNum,
        }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.error || 'Failed to save profile');
      }
      const profile = await resp.json();
      setSavedProfile({ id: profile.id, createdAt: profile.createdAt });
      const recResp = await fetch(`${PYTHON_API_URL}/recommend`);
      if (!recResp.ok) throw new Error('Recommendation service error');
      const recs: string[] = await recResp.json();
      setRecommendations(recs);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 d-flex flex-column align-items-center">
      <h1
        className="mb-4 text-center text-white"
        style={{
          margin: 0,
          padding: '12px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Subtle transparency for a modern effect
          borderRadius: '20px', // Large rounded corners for a sleek look
          color: '#fff',
          textAlign: 'center',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)', // Subtle shadow for floating effect
        }}
      >
        AP Class Recommendation
      </h1>

      <Card className="w-100 mb-4" style={{ maxWidth: '600px' }}>
        <Card.Body>
          <form onSubmit={handleSubmit} className="w-100">
            {error && <div className="alert alert-danger text-center">{error}</div>}

            <div className="mb-3">
              <label htmlFor="interests" className="form-label d-block text-center">
                <strong>Your Interests</strong>
                <input
                  id="interestsText"
                  type="text"
                  className="form-control mt-2"
                  placeholder="e.g. calculus, robotics, AI"
                  value={interestsText}
                  onChange={e => setInterestsText(e.target.value)}
                />
              </label>
              <div className="form-text text-center">Comma-separate your interests.</div>
            </div>

            <Form.Group className="mb-3" controlId="courses">
              <Form.Label><strong>Previous Courses</strong></Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Algebra II, Biology"
                value={coursesText}
                onChange={(e) => setCoursesText(e.target.value)}
              />
              <Form.Text className="text-muted">
                Comma-separate courses you&apos;ve taken.
              </Form.Text>
            </Form.Group>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="GPA" className="form-label text-center d-block">
                  <strong>GPA</strong>
                  <input
                    id="GPA"
                    type="number"
                    step="0.01"
                    className="form-control mt-2"
                    value={GPA}
                    onChange={e => setGPA(e.target.value)}
                  />
                </label>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="gradeLevel" className="form-label text-center d-block">
                  <strong>Grade Level</strong>
                  <select
                    id="gradeLevel"
                    className="form-select mt-2"
                    value={gradeLevel}
                    onChange={e => setGradeLevel(e.target.value)}
                  >
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary px-5" disabled={loading}>
                {loading ? 'Saving & Recommending...' : 'Submit'}
              </button>
            </div>
          </form>

          {savedProfile && (
          <div className="alert alert-success text-center mt-4">
            {`Profile saved (ID: ${savedProfile.id}) at ${new Date(savedProfile.createdAt).toLocaleString()}.`}
          </div>
          )}

          {recommendations.length > 0 && (
          <div className="mt-4">
            <h2 className="text-center mb-3">Recommendations</h2>
            <ul className="list-group">
              {recommendations.map((r) => (
                <li key={r} className="list-group-item">
                  {r}
                </li>
              ))}
            </ul>
          </div>
          )}
        </Card.Body>
      </Card>
    </div>

  );
}
