import React, { useMemo } from 'react'
import { useAuth0 } from "@auth0/auth0-react";

import './App.scss'

import { Topbar } from './components/Topbar'
import { Sidebar } from './components/Sidebar'
import Container from 'react-bootstrap/Container'
import { SplashPage } from './components/SplashPage'

export const App = ({
  router,
  ...props
}) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const tokenPromise = useMemo(async () => getAccessTokenSilently(), []);
  tokenPromise.then((token) => { localStorage.setItem('accessToken', token) });

  return (
    isAuthenticated ? (
      <>
        <Topbar />
        <div className='wrapper'>
          <Sidebar />
          <Container className='ms-5 pe-0' fluid>
            {props.children}
          </Container>
        </div>
      </>
    ) : <>
    <SplashPage/>
    </>
  )
}

export default App
