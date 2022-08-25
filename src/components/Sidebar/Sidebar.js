import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Sidebar.scss'

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBooks, faHome, faGear, faBriefcase, faUsers, faUser, faAnglesLeft, faBookOpenCover } from '@fortawesome/pro-light-svg-icons';
import Button from 'react-bootstrap/Button'

export const Sidebar = ({
  location,
  ...props
}) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  }

  return (
    <nav id='sidebar' className={`${expanded === true ? 'expanded' : 'collapsed'} bg-light px-2`}>
      <Row className='d-flex align-items-center institution-name' onClick={toggleExpanded}>
        <Col className='col-9 ps-3 py-3'>
          <h3 className='text-deep-gray2 mb-0'>ICM</h3>
        </Col>
      </Row>
      <Row>
        <ListGroup className='pe-0 text-primary' defaultActiveKey={location ? location.pathname : '/'}>
          <ListGroup.Item action active href='/'>
            <div className='d-inline sidebar-icon'><FontAwesomeIcon icon={faBookOpenCover} className='fa-fw' /></div>
            <p className=' ms-2 sidebar-item-label d-inline'>{t('menus:headings.my-pps')}</p>
          </ListGroup.Item>
          <ListGroup.Item action href='/jobs'>
            <div className='d-inline sidebar-icon'><FontAwesomeIcon icon={faBriefcase} className='fa-fw' /></div>
            <p className='ms-2 sidebar-item-label d-inline'>{t('menus:headings.job-types')}</p>
          </ListGroup.Item>
          <ListGroup.Item action href='/users'>
            <div className='d-inline sidebar-icon'><FontAwesomeIcon icon={faUsers} className='fa-fw' /></div>
            <p className='ms-2 sidebar-item-label d-inline'>{t('menus:headings.users')}</p>
          </ListGroup.Item>
          <ListGroup.Item action href='/user'>
            <div className='d-inline  sidebar-icon'><FontAwesomeIcon icon={faUser} className='fa-fw' /></div>
            <p className='ms-2 sidebar-item-label d-inline'>{t('menus:headings.my-account')}</p>
          </ListGroup.Item>
        </ListGroup>
      </Row>
      <div className='project-bar'>
        <div className='project-bar-content flex-row d-flex align-items-stretch justify-content-between '>
          <div className=''>
            <Button className='px-1' variant='link'>
              <FontAwesomeIcon icon={faGear}/>
            </Button>
          </div>
          <div className=''>
          <Button className='o-none' variant='link' onClick={toggleExpanded}>
            <FontAwesomeIcon className={expanded ? '' : 'a-180'} icon={faAnglesLeft}/>
          </Button>

          </div>
        </div>
      </div>
    </nav>)
}

export default Sidebar
