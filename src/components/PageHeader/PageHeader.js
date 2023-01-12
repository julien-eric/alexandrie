import React from 'react'
import './PageHeader.scss'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import Col from 'react-bootstrap/Col'

export const PageHeader = ({
  ...props
}) => {
  const { t } = useTranslation();
  const location = useLocation().pathname;

  let title = location === '/' ? 'my-pps': location.substring(1);

  return (
    <Row className='my-4'>
        <h2 className='text-black'>
          {t(`general:headings.${title}`)}
        </h2>
        <Nav
          defaultActiveKey={'pp'}
          className='add-entry'
          as="ul"
          onSelect={(selectedKey) => {
              // setTab(selectedKey);
              // props.setFolder(selectedKey === 'folder');
            }
          }
        >
        </Nav>
    </Row>)
}

export default PageHeader
