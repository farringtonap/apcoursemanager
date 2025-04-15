'use client'; // <-- Add this to indicate Client Component

import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';

const HomePage: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [recommendedClasses, setRecommendedClasses] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recommendations = ["AP Calculus", "AP Physics", "AP Computer Science", "AP Biology"];
    setRecommendedClasses(recommendations);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">AP Class Recommendations</Card.Title>
              <p className="text-center">Find the best AP classes for your interests!</p>
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
            <Card className="mt-4">
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

      {/* Informational Boxes */}
      <Row className="justify-content-center mt-5">
        <Col md={5} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Purpose of the Website</Card.Title>
              <p>
                This website helps students find the most relevant AP classes based on their interests and academic background. It provides personalized recommendations to help students make informed decisions about their AP course selections.
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>How It Works</Card.Title>
              <p>
                Students input their academic interests, and the system uses an intelligent recommendation engine to suggest the most relevant AP classes. The goal is to help students discover courses that align with their goals and academic strengths.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
