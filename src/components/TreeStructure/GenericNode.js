import React from 'react'
import { LeafNode, FolderNode } from '../TreeStructure';

export const GenericNode = ({
  selected,
  apiRoute,
  renderItemParams,
  offsetPerLevel,
  setPdfFile,
  handleShow,
  onSelect,
  ...props
}) => {

  // Switch to debug
  const debug = {
    showID: false,
    showSO: false 
  }

  const { item, provided, snapshot } = renderItemParams;
  let classes = 'tree-node';
  if(snapshot.isDragging) classes += ' dragging';
  if(selected === item.data._id) classes += ' selected ';

  return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {item.data.folder ?
          <FolderNode
            apiRoute={apiRoute}
            inheritedClasses={classes += ' folder'}
            renderItemParams={renderItemParams}
            offsetPerLevel={offsetPerLevel}
            setPdfFile={setPdfFile}
            handleShow={handleShow}
            onSelect={onSelect}
            debug={debug}
          />  :
          <LeafNode
            apiRoute={apiRoute}
            inheritedClasses={classes += ' leaf'} 
            renderItemParams={renderItemParams}
            offsetPerLevel={offsetPerLevel}
            setPdfFile={setPdfFile}
            handleShow={handleShow} 
            onSelect={onSelect}
            debug={debug}
          />
        }
    </div>
  );
}

export default GenericNode
