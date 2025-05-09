'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Form } from 'react-bootstrap';

export default function RecommendationFormPage() {
  // Read once at build time, provide a sane default for local dev:
  const RAW_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL ?? 'http://localhost:8000';
  // Trim any trailing slash so we never end up with "//recommend"
  const API_BASE_URL = RAW_API_URL.replace(/\/$/, '');

  useEffect(() => {
    console.log('🌐 Using Python API at:', API_BASE_URL);
  }, [API_BASE_URL]);

  // form fields
  const [interestsText, setInterestsText] = useState('');
  const [coursesText, setCoursesText] = useState('');
  const [GPA, setGPA] = useState('');
  const [gradeLevel, setGradeLevel] = useState('11');

  // UI states
  const [loading, setLoading] = useState(false);
  const [savedProfile, setSavedProfile] = useState<{ id: number; createdAt: string } | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setRecommendations([]);
    setSavedProfile(null);

    // parse
    const interests = interestsText.split(',').map((s) => s.trim()).filter(Boolean);
    const previousCourses = coursesText.split(',').map((s) => s.trim()).filter(Boolean);
    const gpaNum = parseFloat(GPA);
    const gradeNum = parseInt(gradeLevel, 10);

    // validate
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
      // 1) Save the student profile
      const resp = await fetch('/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests, previousCourses, GPA: gpaNum, gradeLevel: gradeNum }),
      });
      if (!resp.ok) {
        const err = (await resp.json().catch(() => null)) as any;
        throw new Error(err?.error || 'Failed to save profile');
      }
      const profile = await resp.json();
      setSavedProfile({ id: profile.id, createdAt: profile.createdAt });

      // 2) Fetch recommendations from your Python API
      const recResp = await fetch(`${API_BASE_URL}/recommend`);
      if (!recResp.ok) {
        throw new Error(`Recommendation service error: ${recResp.status}`);
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
    <div className="container mt-4 d-flex flex-column align-items-center">
      <h1 className="mb-4 text-center">AP Class Recommendation</h1>

      <form onSubmit={handleSubmit} className="mb-4 w-100" style={{ maxWidth: '600px' }}>
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <div className="mb-3">
          <label htmlFor="interestsText" className="form-label d-block text-center">
            Your Interests
            <input
              id="interestsText"
              type="text"
              className="form-control mt-2"
              placeholder="e.g. calculus, robotics, AI"
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
            />
          </label>
          <div className="form-text text-center">Comma-separate your interests.</div>
        </div>

        <Form.Group className="mb-3" controlId="coursesText">
          <Form.Label>Previous Courses</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Algebra II, Biology"
            value={coursesText}
            onChange={(e) => setCoursesText(e.target.value)}
          />
          <Form.Text className="text-muted">
            Comma-separate courses you’ve taken.
          </Form.Text>
        </Form.Group>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="GPA" className="form-label text-center d-block">
              GPA
              <input
                id="GPA"
                type="number"
                step="0.01"
                className="form-control mt-2"
                value={GPA}
                onChange={(e) => setGPA(e.target.value)}
              />
            </label>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="gradeLevel" className="form-label text-center d-block">
              Grade Level
              <select
                id="gradeLevel"
                className="form-select mt-2"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
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
        <div className="alert alert-success text-center w-100" style={{ maxWidth: '600px' }}>
          {`Profile saved (ID: ${savedProfile.id}) at ${new Date(savedProfile.createdAt).toLocaleString()}.`}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="w-100" style={{ maxWidth: '600px' }}>
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
    </div>
  );
}
