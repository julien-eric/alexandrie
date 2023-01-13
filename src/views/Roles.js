import React, { useState } from 'react'
import { App } from '../App'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export const Roles = ({ ...props }) => {
  const { t } = useTranslation();
  const [pdfFile, setPdfFile] = useState();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState();
  const [ancestry, setAncestry] = useState([]);
  const [folder, setFolder] = useState(false);

  return (
    <App router={props.router} pdfFile={pdfFile} setPdfFile={setPdfFile}>

      <div className='wrapper2'>
        <Row className='w-100 me-2'>
          <Col className='tree-root'>
            <PageHeader />
            <Tree 
              apiRoute={'roles'}
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
