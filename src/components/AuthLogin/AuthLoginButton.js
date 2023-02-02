import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import './AuthLogin.scss';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import i18n from 'i18next'

export const Profile = () => {
  const { loginWithRedirect } = useAuth0();
  const { logout } = useAuth0();
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  
  const toggleLanguage = (languageCode) => {
    let targetLanguage = 'fr';
    if(localStorage.getItem('i18nextLng') === 'fr')
      targetLanguage = 'en';
    
    i18n.changeLanguage(targetLanguage, (err, t) => {
      if (err) return console.log('something went wrong loading', err);
      t('key'); // -> same as i18next.t
    });
  }
  return (
    isAuthenticated ? (
      <>
        <Nav.Link href="#link" className="pe-0">
          <img className="fluid rounded-circle" width="40" src={user.picture} alt={user.name} />
        </Nav.Link>
        <NavDropdown title={user.name} id="basic-nav-dropdown">
          <NavDropdown.Item href="#">{user.email}</NavDropdown.Item>
          <NavDropdown.Item href="#" onClick={toggleLanguage}>Language</NavDropdown.Item>
          <NavDropdown.Item href="#" onClick={() => logout({ returnTo: window.location.origin })}>Log Out</NavDropdown.Item>
        </NavDropdown>
      </>
    ) : <>
      <Nav.Link href="#link" onClick={() => loginWithRedirect()}>Login</Nav.Link>
    </>

  );
};
