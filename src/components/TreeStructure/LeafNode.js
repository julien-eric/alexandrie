import React, { useState } from 'react'
import { getS3Link } from '../../utils.js'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { ICON_STATE, ThreeStateIcon } from '../ThreeStateIcon/ThreeStateIcon';
import { faFilePdf, faSpinner, faFileCircleXmark } from '@fortawesome/pro-thin-svg-icons'

// Switch to debug
const showSO = false;

export const LeafNode = ({
  selected,
  renderItemParams,
  setPdfFile,
  handleShow,
  inheritedClasses,
  onSelect,
  ...props
}) => {
  const { item } = renderItemParams;
  const [loading, setLoading] = useState(ICON_STATE.INITIAL);

  const handleFileClick = async (e) => {
    e.preventDefault();
    setLoading(ICON_STATE.LOADING);
    if(item.data.files !== undefined && item.data.files[0]) {
      const link = await getS3Link(item.data.files[0]);
      setPdfFile(link)
      setLoading(ICON_STATE.FINAL);
    } else {
      setLoading(ICON_STATE.ERROR);
      setTimeout(() => {setLoading(ICON_STATE.INITIAL)}, 1000)
    }
  }
  
  return (
    <div 
      className={inheritedClasses}
      onClick={(e) => onSelect(item.data._id)}
    >
      <span>
        <Button variant="link" size="sm" className='round d-inline' bg="deep-gray">
          <ThreeStateIcon icons={{ initial: faFilePdf, loading: faSpinner, final: faFilePdf, error: faFileCircleXmark }} iconState={loading} />
        </Button>
      </span>

      <span>{item.data ? item.data.name : ''}</span>
      
      {showSO && item.data.sortOrder !== undefined ?
        <Badge className='size-badge round' bg="deep-gray ms-2">{item.data.sortOrder}</Badge> :
        <></>
      }

    </div>
  );
}

export default LeafNode
