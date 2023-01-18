import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { useTranslation } from 'react-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FolderNodeAction } from './FolderNodeAction'
import { faAngleDown, faAngleRight, faFolderClosed, faHyphen, faBriefcase, faSquareCheck, faSquare } from '@fortawesome/pro-light-svg-icons'
import { ICON_STATE, ThreeStateIcon } from '../ThreeStateIcon/ThreeStateIcon';

export const FolderNode = ({
  apiRoute,
  renderItemParams,
  offsetPerLevel,
  handleShow,
  inheritedClasses,
  onSelect,
  selected,
  debug,
  ...props
}) => {
  const { t } = useTranslation();
  const { item, onExpand, onCollapse, provided } = renderItemParams;

  const folderCategory = (level) => {
    if(level == 0) return 'Service';
    if(level == 1) return 'Département';
    if(level == 2) return 'Unité';
    if(level === undefined) return undefined
  } 
  const levelCategory = folderCategory(provided.draggableProps.style.paddingLeft / offsetPerLevel);

  const getIcon = (
    item,
    onExpand,
    onCollapse
  ) => {
    if (item.children && item.children.length > 0) {
      return(
        <Button variant="link" size="sm" onClick={() => item.isExpanded ? onCollapse(item.id) : onExpand(item.id)} className='round d-inline text-black' bg="deep-gray">
          <FontAwesomeIcon className='fa-fw' icon={item.isExpanded ? faAngleDown : faAngleRight} />
        </Button>
      )
    } else if (item.data.folder) {
      return (<span className='round d-inline text-black' bg="deep-gray">
          <Button variant="link" size="sm" onClick={() => item.isExpanded ? onCollapse(item.id) : onExpand(item.id)} className='round d-inline text-black' bg="deep-gray">
            <FontAwesomeIcon className='fa-fw' icon={faHyphen} />
          </Button>
        </span>
      )
    }
  };

  const handleFolderClick = (e, createFolder) => {
    // e.preventDefault();
    handleShow(item.data, createFolder);
  };

  const onClick = (e) => {
    if (e.type === 'click' && e.clientX !== 0 && e.clientY !== 0) {
      if(item.isExpanded) {
        return onCollapse(item.id);
      } else {
        return onExpand(item.id);
      } 
    }
  }

  return (
    <div 
      className={inheritedClasses}
      onClick={onClick}
    >
      <span className='ps-2 pe-2' onClick={(e) => {
        e.stopPropagation();
        onSelect()
      }}>
        {
            selected ? <FontAwesomeIcon icon={faSquareCheck} /> : <FontAwesomeIcon icon={faSquare} />
        }
      </span>

      <span>{getIcon(item, onExpand, onCollapse)}</span>

      <FolderNodeAction
        apiRoute={apiRoute}
        actions= {['Show Politics']}
        handleFolderClick={handleFolderClick}
      />


      <span className='text-black'>{item.data ? item.data.name : ''}</span>
      
      <Badge bg="canvas-gray text-primary ms-2">
        {levelCategory}
      </Badge>

      {debug.showSO && item.data.sortOrder !== undefined ?
        <Badge className='size-badge round' bg="deep-gray ms-2">{item.data.sortOrder}</Badge> :
        <></>
      }
      {debug.showID ?
        <Badge className='size-badge round' bg="deep-gray ms-2">{item.data._id}</Badge> :
        <></>
      }
      {item.children.length !== 0 ?
        <Badge className='size-badge round' bg="deep-gray ms-2">{item.children.length}</Badge> :
        <></>
      }
    </div>
  );
}

export default FolderNode
