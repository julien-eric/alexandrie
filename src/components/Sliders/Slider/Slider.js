import React, { useState } from 'react'
import './Slider.scss'
import Offcanvas from 'react-bootstrap/Offcanvas'

export const Slider = ({
  location,
  ...props
}) => {

  return (
    <>
      <Offcanvas 
        show={props.show !== false && props.show !== undefined}
        onHide={props.handleClose}
        placement={props.placement}
        // backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <h2 className='fw-bold'>
              {props.title}
            </h2>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='pt-0'>
          {props.children}
        </Offcanvas.Body>
      </Offcanvas>
    </>)
}

export default Slider