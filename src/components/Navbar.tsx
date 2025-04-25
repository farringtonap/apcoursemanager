/* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const role = (session?.user as any)?.randomKey; // your role key
  const path = usePathname();

  const navLinkStyle = { color: 'black' };
  const activeStyle = { color: '#808080' };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid className="px-0">
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              href="/"
              style={path === '/' ? activeStyle : navLinkStyle}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              href="/ap-classes"
              style={path === '/ap-classes' ? activeStyle : navLinkStyle}
            >
              AP Classes
            </Nav.Link>

            <Nav.Link
              as={Link}
              href="/dashboard"
              style={path === '/dashboard' ? activeStyle : navLinkStyle}
            >
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={Link}
              href="/recommendation"
              style={path === '/recommendation' ? activeStyle : navLinkStyle}
            >
              Assessment Form
            </Nav.Link>

            {currentUser && (
              <>
                <Nav.Link
                  as={Link}
                  href="/add"
                  style={path === '/add' ? activeStyle : navLinkStyle}
                >
                  Add Stuff
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  href="/list"
                  style={path === '/list' ? activeStyle : navLinkStyle}
                >
                  List Stuff
                </Nav.Link>
              </>
            )}

            {currentUser && role === 'ADMIN' && (
              <Nav.Link
                as={Link}
                href="/admin"
                style={path === '/admin' ? activeStyle : navLinkStyle}
              >
                Admin
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto me-3">
            {session ? (
              <NavDropdown title={currentUser} menuVariant="dark">
                <NavDropdown.Item as={Link} href="/api/auth/signout">
                  <BoxArrowRight /> Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/auth/change-password">
                  <Lock /> Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown title="Login" menuVariant="dark">
                <NavDropdown.Item as={Link} href="/auth/signin">
                  <PersonFill /> Sign In
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/auth/signup">
                  <PersonPlusFill /> Sign Up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
