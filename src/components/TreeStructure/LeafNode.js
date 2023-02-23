import React, { useState } from 'react'
import { getS3Link } from '../../utils.js'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import ExtraActions from './ExtraActions.js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ICON_STATE, ThreeStateIcon } from '../ThreeStateIcon/ThreeStateIcon';
import { faFilePdf, faSpinner, faFileCircleXmark } from '@fortawesome/pro-thin-svg-icons'
import { faSquare, faBadge, faPen, faTrash } from '@fortawesome/pro-light-svg-icons'
import { faSquareCheck } from '@fortawesome/pro-solid-svg-icons'
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons'

export const LeafNode = ({
  selected,
  apiRoute,
  selectMode,
  renderItemParams,
  setFileSelection,
  showDetails,
  onDelete,
  inheritedClasses,
  onSelect,
  debug,
  ...props
}) => {
  const { item } = renderItemParams;
  const [loading, setLoading] = useState(ICON_STATE.INITIAL);

  const handleFileClick = async (e) => {
    e.preventDefault();
    if(apiRoute === 'entries') {
      setLoading(ICON_STATE.LOADING);
      if(item.data.files !== undefined && item.data.files[0]) {
        const link = await getS3Link(item.data.files[0]);
        setFileSelection({entryId: item.data._id, read:item.data.read, pdfFile: link});
        setLoading(ICON_STATE.FINAL);
      } else {
        setLoading(ICON_STATE.ERROR);
        setTimeout(() => {setLoading(ICON_STATE.INITIAL)}, 1000)
      }
    }
  }
  
  return (
    <Row
      as='div' 
      className={inheritedClasses}
      onClick={handleFileClick}
    >
      <Col className='col-auto text-start'>
        {selectMode ? 
          <span className='p-2' onClick={(e) => {
            e.stopPropagation();
            onSelect()
          }}>
            { selected ? <FontAwesomeIcon className='text-primary' icon={faSquareCheck} /> : <FontAwesomeIcon icon={faSquare} />}
          </span>
          : <></>  
        }

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
        <span className='ms-2 read-badge text-primary'>
          <FontAwesomeIcon className='text-primary' icon={item.data.read ? faBadgeCheck : faBadge} />
        </span>
      </Col>

      <Col className='manager-options col-auto pe-0 ms-auto'>
        <ExtraActions
          item={item}
          showDetails={() => showDetails(item)} 
          onDelete={onDelete} 
        />
      </Col>
    </Row>
  );
}

export default LeafNode
