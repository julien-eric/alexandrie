import React, { useMemo } from 'react'
import { useAuth0 } from "@auth0/auth0-react";

import './App.scss'

import { Topbar } from './components/Topbar'
import { Sidebar } from './components/Sidebar'
import Container from 'react-bootstrap/Container'
import { useLocation } from 'react-router-dom'
import { PDFViewer } from './components/Sliders/PDFViewer'
import { SplashPage } from './components/SplashPage'

export const App = ({
  router,
  pdfFile,
  setPdfFile,
  ...props
}) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const tokenPromise = useMemo(async () => getAccessTokenSilently(), []);
  tokenPromise.then((token) => { localStorage.setItem('accessToken', token) });

  return (
    isAuthenticated ? (
      <>
        <PDFViewer
          show={!!pdfFile}
          setPdfFile={setPdfFile}
          pdfFile={pdfFile}
        />
        <Topbar />
        <div className='wrapper'>
          <Sidebar location={useLocation} />
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
