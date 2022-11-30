import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import './AuthLogin.scss';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';

export const Profile = () => {
  const { loginWithRedirect } = useAuth0();
  const { logout } = useAuth0();
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated ? (
      <>
        <Nav.Link href="#link" className="pe-0">
          <img className="fluid rounded-circle" width="40" src={user.picture} alt={user.name} />
        </Nav.Link>
        <NavDropdown title={user.name} id="basic-nav-dropdown">
          <NavDropdown.Item href="#">{user.email}</NavDropdown.Item>
          <NavDropdown.Item href="#">Language</NavDropdown.Item>
          <NavDropdown.Item href="#" onClick={() => logout({ returnTo: window.location.origin })}>Log Out</NavDropdown.Item>
        </NavDropdown>
      </>
    ) : <>
      <Nav.Link href="#link" onClick={() => loginWithRedirect()}>Login</Nav.Link>
    </>

  );
};
