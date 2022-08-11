import React from 'react'
import './PageHeader.scss'
import { useTranslation } from 'react-i18next'

import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import Col from 'react-bootstrap/Col'

export const Sidebar = ({
  title,
  ...props
}) => {
  const { t } = useTranslation()

  return (
    <Row className='my-4'>
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
          <Nav.Item as="li">
            <Nav.Link eventKey="pp">
            <h2 className='text-black'>
              {t('general:headings.my-pps')}
            </h2>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as="li" disabled>
            <Nav.Link eventKey="library" disabled>
              <h4 className='mt-2 border-left'>
                Bibliothèque
              </h4>
            </Nav.Link>
          </Nav.Item>
        </Nav>
    </Row>)
}

export default Sidebar
