import React, { useState } from 'react'
import { App } from '../App'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { AddEntry } from '../components/Sliders/AddEntry'
import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'
import { PDFViewer } from '../components/Sliders/PDFViewer'
import { useSWRConfig }  from 'swr'

export const MyPps = ({ ...props }) => {
  const [pdfFile, setPdfFile] = useState();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState();
  const [ancestry, setAncestry] = useState([]);
  const [folder, setFolder] = useState(false);
  const { mutate } = useSWRConfig()

  const handleShow = (newEntryParent, ancestry, folder = false) => {
    setExpanded(true);
    if (folder) setFolder(true)
    setAncestry(ancestry)
    setSelected(newEntryParent._id)
  }

  const handleClose = async () => {
    await mutate('http://localhost:3000/entries');
    setExpanded(false);
  }

  return (
    <App router={props.router}>

      <PDFViewer
        show={!!pdfFile}
        setPdfFile={setPdfFile}
        pdfFile={pdfFile}
      ></PDFViewer>

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
