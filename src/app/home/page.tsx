'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';

const HomePage: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [recommendedClasses, setRecommendedClasses] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy recommendation logic – replace with your actual logic.
    const recommendations = [
      "AP Calculus",
      "AP Physics",
      "AP Computer Science",
      "AP Biology",
    ];
    setRecommendedClasses(recommendations);
  };

  return (
    <Container className="py-5">
      {/* Top Section: Form & Recommendations */}
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="text-center">
                AP Class Recommendations
              </Card.Title>
              <p className="text-center">
                Find the best AP classes for your interests!
              </p>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formInterests">
                  <Form.Label>Your Interests</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your interests (e.g., Math, Science)"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3 w-100">
                  Get Recommendations
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {recommendedClasses.length > 0 && (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Recommended AP Classes</Card.Title>
                <ul>
                  {recommendedClasses.map((className, index) => (
                    <li key={index}>{className}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* New Informational Boxes */}
      <Row className="justify-content-center mt-5">
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Purpose</Card.Title>
              <Card.Text>
                To prepare students for the pace and academic rigor of college-level courses.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Benefits & Application</Card.Title>
              <Card.Text>
                <strong>Benefits:</strong> Earn college credit and develop skills to help you succeed in college.
                <br/><br/>
                <strong>Apply:</strong> Contact Mrs. Koanui or the respective AP teacher for an application when registration opens. After filling out your information, be sure to get the signatures from your school counselor and your parent/guardian before submitting to Mrs. Koanui.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>No-Drop Policy</Card.Title>
              <Card.Text>
                There is a strict no-drop policy for an AP class unless there is an exceptional reason.
                <br/><br/>
                If a student wishes to drop, they must schedule a meeting with the AP Coordinator, the VP, and their parents to discuss the reasons.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
