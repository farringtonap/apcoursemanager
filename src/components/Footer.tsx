import { Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3" style={{ backgroundColor: '#ffffff' }}>
    <Container>
      <Col className="text-center">
        Created by Levi Kuhaulua, Ivan Ramel, Harrison Law, James Yamada, Deavyn Etscheit
        {' '}
        <a href="https://github.com/farringtonap/farrington-ap.github.io">Github Page</a>
      </Col>
    </Container>
  </footer>
);

export default Footer;
