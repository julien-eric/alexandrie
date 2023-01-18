import React, { useState } from 'react'
import { App } from '../App'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'
import { PolicySelection } from '../components/Sliders/PolicySelection'

import { RoleDetails } from '../components/Sliders/RoleDetails'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useSWRConfig }  from 'swr'

export const Roles = ({ ...props }) => {
  const { t } = useTranslation();
  const [pdfFile, setPdfFile] = useState();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState();
  const [ancestry, setAncestry] = useState([]);
  const [folder, setFolder] = useState(false);
  const { mutate } = useSWRConfig()
  
  const selectPolicyMode = true;

  const handleShowRoleDetails = (newEntryParent, ancestry, folder = false) => {
    setExpanded(true);
    if (folder) setFolder(true)
    setAncestry(ancestry)
    setSelected(newEntryParent._id)
  }

  const handleClose = async () => {
    await mutate('https://localhost:3000/roles');
    setExpanded(false);
  }

  return (
    <App router={props.router} pdfFile={pdfFile} setPdfFile={setPdfFile}>

      <PolicySelection
        show={selectPolicyMode}
      />

      <div className='wrapper2'>
        <Row className='w-100 me-2'>
          <Col className='tree-root'>
            <PageHeader />
            <Tree 
              apiRoute={'roles'}
              selected={selected}
              setSelected={setSelected}
              handleShow={handleShowRoleDetails}
              handleClose={handleClose}
            />
          </Col>
        </Row>
          <RoleDetails
            expanded={expanded}
            folder={folder}
            ancestry={ancestry}
            setFolder={setFolder}
            handleClose={handleClose}
          />
      </div>

    </App>
  )
}

export default Roles
