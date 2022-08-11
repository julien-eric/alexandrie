import React from 'react'
import { LeafNode, FolderNode } from '../TreeStructure';

export const GenericNode = ({
  selected,
  renderItemParams,
  offsetPerLevel,
  setPdfFile,
  handleShow,
  ...props
}) => {

  const { item, provided, snapshot } = renderItemParams;

  let classes = 'tree-node'
  if(snapshot.isDragging) classes += ' dragging'

  return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {item.data.folder ? 
          <FolderNode
            inheritedClasses={classes += ' folder'}
            renderItemParams={renderItemParams}
            offsetPerLevel={offsetPerLevel}
            setPdfFile={setPdfFile}
            handleShow={handleShow} 
          />  :
          <LeafNode
            inheritedClasses={classes += ' leaf'} 
            renderItemParams={renderItemParams}
            offsetPerLevel={offsetPerLevel}
            setPdfFile={setPdfFile}
            handleShow={handleShow} 
          />
        }
    </div>
  );
}

export default GenericNode
