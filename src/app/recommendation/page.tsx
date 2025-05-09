'use client';

import { useState, FormEvent } from 'react';
// Make sure all necessary components are imported if you use them from react-bootstrap
// e.g., Button, Alert, ListGroup, Row, Col, Container if you use their specific components
// For now, assuming you're using bootstrap classes on standard HTML elements or
// the specific <Card> and <Form> components from react-bootstrap.
import { Card, Form } from 'react-bootstrap';

// Build-time API URL; strip any trailing slashes to avoid '//recommend' 404s
const PYTHON_API_URL = (process.env.NEXT_PUBLIC_PYTHON_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '');

export default function RecommendationFormPage() {
  // Form inputs state
  const [interestsText, setInterestsText] = useState('');
  const [coursesText, setCoursesText] = useState('');
  const [GPA, setGPA] = useState('');
  const [gradeLevel, setGradeLevel] = useState('11');

  // UI states
  const [loading, setLoading] = useState(false);
  const [savedProfile, setSavedProfile] = useState<{ id: number; createdAt: string } | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]); // Correctly initialized
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setRecommendations([]); // Reset recommendations
    setSavedProfile(null);

    // 1) parse
    const interests = interestsText.split(',').map((s) => s.trim()).filter(Boolean);
    const previousCourses = coursesText.split(',').map((s) => s.trim()).filter(Boolean);
    const gpaNum = parseFloat(GPA);
    const gradeNum = parseInt(gradeLevel, 10);

    // 2) validate
    if (!interests.length) {
      setError('Please enter at least one interest.');
      return;
    }
    if (isNaN(gpaNum)) { // Use Number.isNaN for robust NaN check
      setError('Please enter a valid GPA.');
      return;
    }
    // Optional: Add more GPA validation (e.g., range)
    if (gpaNum < 0 || gpaNum > 5.0) { // Example range
        setError('Please enter a GPA between 0.0 and 5.0.');
        return;
    }

    setLoading(true);
    try {
      // Save student profile via Next.js API route
      const profileResp = await fetch('/api/student', { // This is your Next.js API route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests, previousCourses, GPA: gpaNum, gradeLevel: gradeNum }),
      });
      if (!profileResp.ok) {
        const errJson = await profileResp.json().catch(() => null); // Try to get error from body
        throw new Error(errJson?.error || `Failed to save profile: ${profileResp.status} ${profileResp.statusText}`);
      }
      const profile = await profileResp.json();
      setSavedProfile({ id: profile.id, createdAt: profile.createdAt });

      // Build and log recommendation endpoint
      const recUrl = `${PYTHON_API_URL}/recommend`;
      console.log('Fetching recommendations from:', recUrl); // <-- CHECK THIS LOG

      // Fetch recommendations from Python backend
      const recResp = await fetch(recUrl);
      if (!recResp.ok) {
        // Try to get more details from the error response if possible
        let errorDetail = `Recommendation service error: ${recResp.status} ${recResp.statusText}`;
        try {
            const errBody = await recResp.json(); // or .text() if not JSON
            errorDetail += ` - ${errBody?.detail || JSON.stringify(errBody)}`;
        } catch (parseError) {
            // ignore if can't parse error body
        }
        throw new Error(errorDetail);
      }
      const recs: string[] = await recResp.json();
      console.log('Received recommendations:', recs); // <-- CHECK THIS LOG (VERY IMPORTANT)
      setRecommendations(recs); // Update state

    } catch (err: any) {
      console.error('Error in handleSubmit:', err); // <-- CHECK THIS LOG FOR ANY ERRORS
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // The JSX structure for rendering. This part is logically correct.
  return (
    <div className="container mt-4 d-flex flex-column align-items-center">
      <h1
        className="mb-4 text-center text-white"
        style={{
          margin: 0,
          padding: '12px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '20px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)',
        }}
      >
        AP Class Recommendation
      </h1>

      <Card className="w-100 mb-4" style={{ maxWidth: '600px' }}>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger text-center">{error}</div>}

            <Form.Group className="mb-3" controlId="interestsText">
              <Form.Label><strong>Your Interests</strong></Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. calculus, robotics, AI"
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                required
              />
              <Form.Text className="text-center w-100">Comma-separate your interests.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="coursesText">
              <Form.Label><strong>Previous Courses</strong> <span className="text-muted">(optional)</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Algebra II, Biology"
                value={coursesText}
                onChange={(e) => setCoursesText(e.target.value)}
              />
              <Form.Text className="text-center w-100 text-muted">Comma-separate courses you've taken.</Form.Text>
            </Form.Group>

            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group controlId="GPA">
                  <Form.Label><strong>GPA</strong></Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.85"
                    value={GPA}
                    onChange={(e) => setGPA(e.target.value)}
                    required
                    min="0" // HTML5 validation
                    max="5" // HTML5 validation (adjust scale if needed)
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group controlId="gradeLevel">
                  <Form.Label><strong>Grade Level</strong></Form.Label>
                  <Form.Select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary px-5" disabled={loading}>
                {loading ? 'Saving & Recommending...' : 'Submit'}
              </button>
            </div>
          </form>

          {/* Display after form submission */}
          {savedProfile && (
            <div className="alert alert-success text-center mt-4">
              {`Profile saved (ID: ${savedProfile.id}) at ${new Date(savedProfile.createdAt).toLocaleString()}.`}
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="mt-4">
              <h2 className="text-center mb-3">Recommendations</h2>
              <ul className="list-group">
                {recommendations.map((rec) => (
                  <li key={rec} className="list-group-item">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}