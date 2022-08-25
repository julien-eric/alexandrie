import React from 'react'

import './App.scss'

import { Topbar } from './components/Topbar'
import { Sidebar } from './components/Sidebar'
import Container from 'react-bootstrap/Container'
import { useLocation } from 'react-router-dom'

export const App = ({
  router,
  ...props
}) => {
  return (
    <>
      <Topbar />
      <div className='wrapper'>
        <Sidebar location={useLocation} />
        <Container className='ms-5 pe-0' fluid>
          {props.children}
        </Container>
      </div>
    </>
  )
}

export default App
