import React, { useState } from 'react'

import './App.scss'

import { Topbar } from './components/Topbar'
import { Sidebar } from './components/Sidebar'
import Container from 'react-bootstrap/Container'
import { useLocation } from 'react-router-dom'
import { PDFViewer } from './components/Sliders/PDFViewer'

export const App = ({
  router,
  pdfFile,
  setPdfFile,
  ...props
}) => {
  return (
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
  )
}

export default App
