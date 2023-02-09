import React from 'react'
import { LeafNode, FolderNode } from '../TreeStructure';

export const GenericNode = ({
  selected,
  onSelect,
  apiRoute,
  selectMode,
  renderItemParams,
  offsetPerLevel,
  setFileSelection,
  showDetails,
  ...props
}) => {

  // Switch to debug
  const debug = {
    showID: false,
    showSO: true 
  }

  const { item, provided, snapshot } = renderItemParams;
  let classes = 'tree-node';
  if(snapshot.isDragging) classes += ' dragging';
  if(selected && selected.indexOf(item.data._id) !== -1) classes += ' selected ';

  return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {item.data.folder ?
          <FolderNode
            apiRoute={apiRoute}
            selectMode={selectMode}
            inheritedClasses={classes += ' folder'}
            renderItemParams={renderItemParams}
            offsetPerLevel={offsetPerLevel}
            setFileSelection={setFileSelection}
            showDetails={showDetails}
            onSelect={() => onSelect(item)}
            selected={selected && selected.indexOf(item.data._id) !== -1}
            debug={debug}
          />  :
          <LeafNode
            apiRoute={apiRoute}
            selectMode={selectMode}
            inheritedClasses={classes += ' leaf'} 
            renderItemParams={renderItemParams}
            offsetPerLevel={offsetPerLevel}
            setFileSelection={setFileSelection}
            showDetails={showDetails} 
            onSelect={() => onSelect(item)}
            selected={selected && selected.indexOf(item.data._id) !== -1}
            debug={debug}
          />
        }
    </div>
  );
}

export default GenericNode
