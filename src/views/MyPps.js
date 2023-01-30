import React, { useState, useMemo } from 'react'
import { App } from '../App'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { AddEntry } from '../components/Sliders/AddEntry'
import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'
import { useSWRConfig }  from 'swr'

export const MyPps = ({ ...props }) => {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState();
  const [ancestry, setAncestry] = useState([]);
  const [folder, setFolder] = useState(false);
  const { mutate } = useSWRConfig()

  const handleShowAddEntry = (newEntryParent, ancestry, folder = false) => {
    setExpanded(true);
    if (folder) setFolder(true)
    setAncestry(ancestry)
    setSelected(newEntryParent._id)
  }

  const handleClose = async () => {
    await mutate('https://localhost:3000/entries');
    setExpanded(false);
  }

  return (
    <App router={props.router}>

      <div className='wrapper2'>
        <Row className='w-100 me-2'>
          <Col className='tree-root'>
            <PageHeader />
            <Tree 
              apiRoute={'entries'}
              handleShow={handleShowAddEntry}
              selected={selected}
              setSelected={setSelected}
            />
          </Col>
        </Row>

        <AddEntry
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

export default MyPps
