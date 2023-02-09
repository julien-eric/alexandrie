import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import './topbar.scss'
import { Profile } from '../AuthLogin/AuthLoginButton'

export const Topbar = ({
  ...props
}) => {
  return (
    <Navbar bg='light' expand='lg' className='alx ps-4  sticky-top'>
      <Navbar.Brand href='#home'>
        <img
          src='./logo.svg'
          width='40'
          height='40'
          className='d-inline-block align-top'
          alt='React Bootstrap logo'
        />
      </Navbar.Brand>
      <Navbar.Brand className='me-5 fw-normal' href='#home2'>ALEXANDRIE</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end me-5 pe-5">
        <Profile />
      </Navbar.Collapse>
    </Navbar>)
}

export default Topbar
