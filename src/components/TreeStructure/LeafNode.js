import React, { useState } from 'react'
import { getS3Link } from '../../utils.js'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ICON_STATE, ThreeStateIcon } from '../ThreeStateIcon/ThreeStateIcon';
import { faFilePdf, faSpinner, faFileCircleXmark } from '@fortawesome/pro-thin-svg-icons'
import { faSquareCheck, faSquare } from '@fortawesome/pro-light-svg-icons'

export const LeafNode = ({
  selected,
  apiRoute,
  renderItemParams,
  setPdfFile,
  handleShow,
  inheritedClasses,
  onSelect,
  debug,
  ...props
}) => {
  const { item } = renderItemParams;
  const [loading, setLoading] = useState(ICON_STATE.INITIAL);

  const handleFileClick = async (e) => {
    e.preventDefault();
    // setLoading(ICON_STATE.LOADING);
    // onSelect(item.data._id);
    // if(item.data.files !== undefined && item.data.files[0]) {
    //   const link = await getS3Link(item.data.files[0]);
    //   setPdfFile(link)
    //   setLoading(ICON_STATE.FINAL);
    // } else {
    //   setLoading(ICON_STATE.ERROR);
    //   setTimeout(() => {setLoading(ICON_STATE.INITIAL)}, 1000)
    // }
  }
  
  return (
    <div 
      className={inheritedClasses}
      onClick={handleFileClick}
    >
      <span className='ps-2 pe-2' onClick={(e) => {
        e.stopPropagation();
        onSelect()
      }}>
        { selected ? <FontAwesomeIcon icon={faSquareCheck} /> : <FontAwesomeIcon icon={faSquare} />}
      </span>
      <span>
        <Button variant="link" size="sm" className='round d-inline' bg="deep-gray">
          <ThreeStateIcon icons={{ initial: faFilePdf, loading: faSpinner, final: faFilePdf, error: faFileCircleXmark }} iconState={loading} />
        </Button>
      </span>

      <span>{item.data ? item.data.name : ''}</span>
      
      {debug.showSO && item.data.sortOrder !== undefined ?
        <Badge className='size-badge round' bg="deep-gray ms-2">{item.data.sortOrder}</Badge> :
        <></>
      }
      {debug.showID ?
        <Badge className='size-badge round' bg="deep-gray ms-2">{item.data._id}</Badge> :
        <></>
      }
    </div>
  );
}

export default LeafNode
