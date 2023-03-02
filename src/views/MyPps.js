import React, { useState, useEffect } from 'react'
import { App } from '../App'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { AddEntry } from '../components/Sliders/AddEntry'
import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'

export const MyPps = ({ ...props }) => {
  const [selected, setSelected] = useState();
  const [parent, setParent] = useState();
  const [itemDetails, setItemDetails] = useState();

  const [expanded, setExpanded] = useState(false);

  const [treeSelectionMode, setTreeSelectionMode] = useState(false);

  useEffect(() => {
    document.title = 'Alexandrie';
  }, []);

  useEffect(() => {
    if(treeSelectionMode && parent)
      setSelected([parent.data._id]) 
  }, [treeSelectionMode, parent]);

  const showEntryDetails = (item, parent) => {
    if(item) {
      setSelected([item.data._id]);
      setItemDetails(item);
    } else {
      setItemDetails(item);
    }
    if(parent) {
      setParent(parent)
    }
    setExpanded(true);
  }

  return (
    <App router={props.router}>

      <div className='wrapper2'>
        <Row className='w-100 me-2'>
          <Col className='tree-root'>
            <PageHeader tempTitle={treeSelectionMode && itemDetails ? itemDetails.data.name : ''}/>
            <Tree 
              apiRoute={'entries'}
              selected={selected}
              setSelected={setSelected}
              setExpanded={setExpanded}
              setParent={setParent}
              showDetails={showEntryDetails}
              singleSelect={treeSelectionMode}
              selectMode={treeSelectionMode}
              foldersOnly={treeSelectionMode}
            />
          </Col>
        </Row>

        {
          expanded ?
            <AddEntry
              apiRoute={'entries'}
              expanded={expanded}
              setExpanded={setExpanded}
              item={itemDetails}
              setItemDetails={setItemDetails}
              treeSelectionMode={treeSelectionMode}
              setTreeSelectionMode={setTreeSelectionMode}
              parent={parent}
              setParent={setParent}
            /> : <></>
        }
      </div>

    </App>
  )
}

export default MyPps
