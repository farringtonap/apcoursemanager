'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import {
  BoxArrowRight,
  Lock,
  PersonFill,
  PersonPlusFill,
} from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const userWithRole = session?.user as { email: string; randomKey: string };
  const role = userWithRole?.randomKey;
  const pathName = usePathname();

  const navLinkStyle = { color: 'white' };
  const navbarStyle = { backgroundColor: '#600a0b' };
  const containerStyle = { marginLeft: '0', paddingLeft: '0px' };
  const activeNavLinkStyle = { fontWeight: 'bold' };
  const navStyle = { marginLeft: '20px' };
  const dropdownStyle = { color: 'white' };
  const rightNavStyle = { marginLeft: 'auto', marginRight: '20px' };

  return (
    <div style={{ backgroundColor: '#600a0b' }}>
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '0px 0' }}
      >
        <Image
          src="/FHS_Logo.png"
          alt="Brand Logo"
          style={{ height: '80px' }}
        />
      </div>
      <Navbar style={navbarStyle} variant="dark" expand="lg">
        <Container style={containerStyle} fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" style={navStyle}>
              <Nav.Link
                href="/"
                style={pathName === '/' ? activeNavLinkStyle : navLinkStyle}
                active={pathName === '/'}
              >
                Home
              </Nav.Link>
              <Nav.Link
                href="/apclasses"
                style={
                  pathName === '/apclasses' ? activeNavLinkStyle : navLinkStyle
                }
                active={pathName === '/apclasses'}
              >
                AP Classes
              </Nav.Link>
              <Nav.Link
                href="/recommendation"
                style={
                  pathName === '/recommendation'
                    ? activeNavLinkStyle
                    : navLinkStyle
                }
                active={pathName === '/recommendation'}
              >
                Assessment Form
              </Nav.Link>

              {/* TEACHER-only My Classes Nav Link */}
              {currentUser && role === 'TEACHER' && (
                <Nav.Link
                  id="view-classes-nav"
                  href="/My-Classes"
                  key="view-classes"
                  active={pathName === '/My-Classes'}
                  style={navLinkStyle}
                >
                  My Classes
                </Nav.Link>
              )}

              {/* ADMIN-only Links */}
              {currentUser && role === 'ADMIN' ? (
                <>
                  <Nav.Link
                    id="edit-classes-nav"
                    href="/CRUD-Classes"
                    key="edit-classes"
                    active={pathName === '/CRUD-Classes'}
                    style={navLinkStyle}
                  >
                    Add/Edit Classes
                  </Nav.Link>
                  <Nav.Link
                    id="edit-prerequisites-nav"
                    href="/CRUD-PreReqs"
                    key="edit-prerequisites"
                    active={pathName === '/CRUD-PreReqs'}
                    style={navLinkStyle}
                  >
                    Add/Edit Prerequisites
                  </Nav.Link>
                </>
              ) : null}

              {currentUser && role === 'ADMIN' && (
                <Nav.Link
                  id="admin-stuff-nav"
                  href="/admin"
                  key="admin"
                  active={pathName === '/admin'}
                  style={navLinkStyle}
                >
                  Admin
                </Nav.Link>
              )}
            </Nav>

            <Nav style={rightNavStyle}>
              {session ? (
                <NavDropdown
                  id="login-dropdown"
                  title={<span style={dropdownStyle}>{currentUser}</span>}
                  menuVariant="dark"
                >
                  <NavDropdown.Item
                    id="login-dropdown-sign-out"
                    href="/api/auth/signout"
                  >
                    <BoxArrowRight />
                    {' '}
                    Sign Out
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    id="login-dropdown-change-password"
                    href="/auth/change-password"
                  >
                    <Lock />
                    {' '}
                    Change Password
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown
                  id="login-dropdown"
                  title={<span style={dropdownStyle}>Login</span>}
                  menuVariant="dark"
                  style={containerStyle}
                  className="login-arrow-white"
                >
                  <NavDropdown.Item
                    id="login-dropdown-sign-in"
                    href="/auth/signin"
                  >
                    <PersonFill />
                    {' '}
                    Sign in
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    id="login-dropdown-sign-up"
                    href="/auth/signup"
                  >
                    <PersonPlusFill />
                    {' '}
                    Sign up
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
