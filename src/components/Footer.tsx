import { Col, Container, Row } from 'react-bootstrap';
import { BoxArrowUpRight, Github } from 'react-bootstrap-icons';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3" style={{ backgroundColor: '#600a0b' }}>
    <Container fluid className="text-center text-white">
      <Row className="mt-2">
        <Col>
          Created by Levi Kuhaulua, Ivan Ramel, Harrison Law, James Yamada, & Deavyn Etscheit
        </Col>
      </Row>
      <Row xs="auto" className="justify-content-center mt-2">
        <Col className="d-inline-flex justify-content-center align-items-center gap-2">
          <BoxArrowUpRight />
          <a href="https://farringtonap.github.io/farrington-ap.github.io/">
            Github Page
          </a>
        </Col>
        <Col className="d-inline-flex justify-content-center align-items-center gap-2">
          <Github />
          <a href="https://github.com/farringtonap/apcoursemanager">
            Source Code
          </a>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
