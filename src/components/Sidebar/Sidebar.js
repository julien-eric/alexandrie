import React from 'react'
import { useTranslation } from 'react-i18next'
import './Sidebar.scss'

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBriefcase, faUsers, faUser } from '@fortawesome/pro-light-svg-icons';

export const Sidebar = ({
  location,
  ...props
}) => {
  const { t } = useTranslation()

  return (
    <nav id='sidebar' className='bg-light px-2'>
      <Row className='d-flex align-items-center institution-name'>
        <Col className='col-9 ps-3 py-3'>
          <h3 className='text-deep-gray2 mb-0'>ICM</h3>
        </Col>
        {/* <Col className='col-2'>
          <i className='text-deep-gray2 align-self-center fs-3 fas fa-angle-right ' />
        </Col> */}
      </Row>
      <Row>
        <ListGroup className='pe-0 text-primary fw-bold' defaultActiveKey={location ? location.pathname : '/'}>
          <ListGroup.Item action active href='/'>
            <div className='d-inline me-2 sidebar-icon'><FontAwesomeIcon icon={faHome} className='fa-fw' /></div>
            <p className='d-inline'>{t('menus:headings.my-pps')}</p>
          </ListGroup.Item>
          <ListGroup.Item action href='/jobs'>
            <div className='d-inline me-2 sidebar-icon'><FontAwesomeIcon icon={faBriefcase} className='fa-fw' /></div>
            {t('menus:headings.job-types')}
          </ListGroup.Item>
          <ListGroup.Item action href='/users'>
            <div className='d-inline me-2 sidebar-icon'><FontAwesomeIcon icon={faUsers} className='fa-fw' /></div>
            {t('menus:headings.users')}
          </ListGroup.Item>
          <ListGroup.Item action href='/user'>
            <div className='d-inline me-2 sidebar-icon'><FontAwesomeIcon icon={faUser} className='fa-fw' /></div>
            {t('menus:headings.my-account')}
          </ListGroup.Item>
        </ListGroup>
      </Row>
    </nav>)
}

export default Sidebar
