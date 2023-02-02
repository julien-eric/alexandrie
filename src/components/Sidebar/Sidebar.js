import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, Link } from 'react-router-dom'
import './Sidebar.scss'

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faBriefcase, faAnglesLeft, faBookOpenCover } from '@fortawesome/pro-light-svg-icons';
import Button from 'react-bootstrap/Button'

export const Sidebar = ({
  ...props
}) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(true);
  const location = useLocation()

  const toggleExpanded = () => {
    setExpanded(!expanded);
  }

  return (
    <nav id='sidebar' className={`${expanded === true ? 'expanded' : 'collapsed'} bg-light px-2`}>
      <Row className='d-flex align-items-center institution-name' onClick={toggleExpanded}>
        <Col className='col-3 ps-3 py-3'>
          <img
            src='./icmlogo.jpg'
            width='40'
            height='40'
            className='d-inline-block align-top'
            alt='React Bootstrap logo'
          />
          {/* <h3 className='text-deep-gray2 mb-0'>ICM</h3> */}
        </Col>
        <Col className='col-9 ps-3 py-3 sidebar-item-label'>
          <h3 className='text-deep-gray2 mb-0'>ICM</h3>
          <small className='text-deep-gray2 mb-0'>Institut Cardio MTL</small>
        </Col>
      </Row>
      <Row>
        <ListGroup className='pe-0 text-primary' defaultActiveKey={location ? location.pathname : '/'}>
          <Link to={"/"}>
            <ListGroup.Item as='div' action href='/'>
              <div className='d-inline sidebar-icon'><FontAwesomeIcon icon={faBookOpenCover} className='fa-fw' /></div>
              <p className=' ms-2 sidebar-item-label d-inline'>{t('menus:headings.my-pps')}</p>
            </ListGroup.Item>
          </Link>
          <Link to={"/roles"}>
            <ListGroup.Item as='div' action href='/roles'>
              <div className='d-inline sidebar-icon'><FontAwesomeIcon icon={faBriefcase} className='fa-fw' /></div>
              <p className='ms-2 sidebar-item-label d-inline'>{t('menus:headings.roles')}</p>
            </ListGroup.Item>
          </Link>
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
