import React from 'react'
import { useTranslation } from 'react-i18next'
import './Sidebar.scss'

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export const Sidebar = ({
  location,
  ...props
}) => {
  const { t } = useTranslation()

  return (
    <nav id='sidebar' className='bg-light px-2'>
      <Row className='d-flex align-items-center institution-name'>
        <Col className='col-9 pt-2'>
          <h3 className='text-deep-gray2 mb-0' >ICM</h3>
          <p className='fs-6 deep-gray2' >Cardiologie Montreal</p>
        </Col>
        <Col className='col-2'>
          <i className='text-deep-gray2 align-self-center fs-3 fas fa-angle-right ' />
        </Col>
      </Row>
      <ListGroup className='pt-3 text-primary fw-bold' defaultActiveKey={location ? location.pathname : '/'}>
        <ListGroup.Item action active href='/'>
          <i className='fas fa-home me-3' />
          {t('menus:headings.my-pps')}
        </ListGroup.Item>
        <ListGroup.Item action href='/jobs'>
          <i className='fas fa-briefcase me-3' />
          {t('menus:headings.job-types')}
        </ListGroup.Item>
        <ListGroup.Item action href='/users'>
          <i className='fas fa-users me-3' />
          {t('menus:headings.users')}
        </ListGroup.Item>
        <ListGroup.Item action href='/user'>
          <i className='fas fa-user me-3' />
          {t('menus:headings.my-account')}
        </ListGroup.Item>
      </ListGroup>
    </nav>)
}

export default Sidebar
