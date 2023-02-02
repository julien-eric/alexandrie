import React, { useState, useEffect, useMemo } from 'react'
import { App } from '../App'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { AddEntry } from '../components/Sliders/AddEntry'
import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'
// import { useSWRConfig }  from 'swr'

export const MyPps = ({ ...props }) => {
  const [selected, setSelected] = useState();
  const [itemDetails, setItemDetails] = useState();

  const [expanded, setExpanded] = useState(false);
  const [folder, setFolder] = useState(false);

  const [treeSelectionMode, setTreeSelectionMode] = useState(false);

  useEffect(() => {
    document.title = 'Alexandrie';
  }, []);
  
  const showEntryDetails = (item, edit, parent) => {
    if(item) {
      setSelected([item.data._id]);
      setItemDetails(item);
    } else {
      setItemDetails(item);
    }
    setExpanded(true);
  }


  return (
    <App router={props.router}>

      <div className='wrapper2'>
        <Row className='w-100 me-2'>
          <Col className='tree-root'>
            <PageHeader />
            <Tree 
              apiRoute={'entries'}
              selected={selected}
              setSelected={setSelected}
              setExpanded={setExpanded}
              showDetails={showEntryDetails}
              selectMode={treeSelectionMode}
            />
          </Col>
        </Row>

        {
          expanded ?
            <AddEntry
              expanded={expanded}
              setExpanded={setExpanded}
              folder={folder}
              setFolder={setFolder}
              item={itemDetails}
              setItemDetails={setItemDetails}
              treeSelectionMode={treeSelectionMode}
              setTreeSelectionMode={setTreeSelectionMode}
            /> : <></>
        }
      </div>

    </App>
  )
}

export default MyPps
