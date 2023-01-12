import React from 'react'
import { App } from '../App'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '../components/PageHeader'

import Row from 'react-bootstrap/Row'

export const Roles = ({ ...props }) => {
  const { t } = useTranslation()

  return (
    <App router={props.router} pdfFile={pdfFile} setPdfFile={setPdfFile}>

      <div className='wrapper2'>
        <Row className='w-100 me-2'>
          <Col className='tree-root'>
            <PageHeader />
            <Tree 
              setPdfFile={setPdfFile} 
              handleShow={handleShow}
              selected={selected}
              setSelected={setSelected}
            />
          </Col>
        </Row>
      </div>

    </App>
  )
}

export default Roles
