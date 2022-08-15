import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import { useTranslation } from 'react-i18next'
import './topbar.scss'

export const Topbar = ({
  ...props
}) => {
  return (
    <Navbar bg='light' expand='lg' className='alx sticky-top'>
      <Navbar.Brand className='ms-4 me-5 fw-normal' href='#home2'>ALEXANDRIE</Navbar.Brand>
    </Navbar>)
}

export default Topbar
