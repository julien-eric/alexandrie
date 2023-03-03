import React, { useMemo, useState } from 'react'
import { useAuth0 } from "@auth0/auth0-react";

import './App.scss'

import { Topbar } from './components/Topbar'
import { Sidebar } from './components/Sidebar'
import Container from 'react-bootstrap/Container'

export const App = ({
  router,
  ...props
}) => {
  let { loginWithRedirect, getAccessTokenSilently, isAuthenticated, isLoading, user } = useAuth0();

  const tokenPromise = useMemo(async () => getAccessTokenSilently(), []);
  tokenPromise.then((token) => { 
    localStorage.setItem('accessToken', token)
    localStorage.setItem('alexandrie-auth/roles', user['alexandrie-auth/roles'])
  });

  if(isLoading) {
    return (
      <div className='jumbotron vertical-center'>
        <Container>
          <div className='mx-auto d-block align-items-center zooming' style={{ width: '10rem' }}>
            <img
              className='shining'
              src='/logo.svg'
              alt='alex-logo'
            />
            <div className='mx-auto text-center'>
              <h3 className='mt-2 logo-text'>ALEXANDRIE</h3>
            </div>
          </div>
        </Container>
      </div>
    )
  }


  if (isAuthenticated) {
    return (
      <>
        <Topbar />
        <div className='wrapper'>
          <Sidebar />
          <Container className='ms-5 pe-0' fluid>
            {props.children}
          </Container>
        </div>
      </>
    );
  } else {
    loginWithRedirect();
  }

}

export default App
