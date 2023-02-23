import React from 'react'
import Button from 'react-bootstrap/Button'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/pro-light-svg-icons'

export const ExtraActions = ({
  selected,
  showDetails,
  onDelete,
  item,
  ...props
}) => {

  const onEdit = (e) => {
    e.stopPropagation();
    showDetails(item);
  } 

  return (
    <>
      <div className='d-inline folder-button caret-off'>
        <Button variant='link' size='sm' onClick={onEdit}>
          <FontAwesomeIcon className='text-primary' icon={faPen} />
        </Button>
      </div>
      <div className='d-inline folder-button caret-off'>
        <Button variant='link' size='sm' onClick={(e)=>{
          e.stopPropagation();
          onDelete(item);
        }}>
          <FontAwesomeIcon className='text-primary' icon={faTrash} />
        </Button>
      </div>
    </>
  );
}

export default ExtraActions
