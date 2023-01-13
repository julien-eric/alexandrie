import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import './Slider.scss'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/pro-light-svg-icons';

export const AddEntry = ({
  expanded,
  handleClose,
  title,
  ...props
}) => {
  return (
    <div id='righthand' className={`${expanded === true ? 'expanded' : 'collapsed'} px-5`}>
      <div id='righthand-level'>
        <Row className='py-4'>
          <Col className='col-10 d-inline-flex align-items-center'>
            <h3 className='text-black'>
              {title}
            </h3>
          </Col>
          <Col className='col-2 d-inline-flex align-items-center'>
            <Button variant='link' onClick={handleClose}>
              <FontAwesomeIcon icon={faX}/>
            </Button>
          </Col>
        </Row>
        {props.children}
      </div>
    </div>)
}

export default AddEntry
