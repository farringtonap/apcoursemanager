'use client';

import { useState, FormEvent } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

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
      return setError('Please enter at least one interest.');
    }
    if (Number.isNaN(gpaNum)) {
      return setError('Please enter a valid GPA.');
    }

    setLoading(true);
    try {
      // 3) POST to Next.js API (/src/app/api/student/route.ts)
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
        // try to pull error message out of JSON
        const err = await resp.json().catch(() => null);
        throw new Error(err?.error || 'Failed to save profile');
      }

      // 4) read returned profile (id, createdAt, etc)
      const profile = await resp.json();
      setSavedProfile({ id: profile.id, createdAt: profile.createdAt });

      // 5) GET recommendations from Python FastAPI
      const recResp = await fetch(`${PYTHON_API_URL}/recommend`);
      if (!recResp.ok) {
        throw new Error('Recommendation service error');
      }
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
    <div className="container mt-4">
      <h1>AP Class Recommendation</h1>

      <Form onSubmit={handleSubmit} className="mb-4">
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3" controlId="interests">
          <Form.Label>Your Interests</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. calculus, robotics, AI"
            value={interestsText}
            onChange={(e) => setInterestsText(e.target.value)}
          />
          <Form.Text className="text-muted">
            Comma-separate your interests.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="courses">
          <Form.Label>Previous Courses</Form.Label>
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

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group controlId="gpa">
              <Form.Label>GPA</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={GPA}
                onChange={(e) => setGPA(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group controlId="grade-level">
              <Form.Label>Grade Level</Form.Label>
              <Form.Select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
              >
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? 'Saving & Recommending...'
            : 'Submit & Get Recommendations'}
        </Button>
      </Form>

      {savedProfile && (
        <Alert variant="success">
          Profile saved (ID:
          {savedProfile.id}
          )
          at
          {' '}
          {new Date(savedProfile.createdAt).toLocaleString()}
          .
        </Alert>
      )}

      {recommendations.length > 0 && (
        <div>
          <h2>Recommendations</h2>
          <ul className="list-group">
            {recommendations.map((r) => (
              <li key={r} className="list-group-item">
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
