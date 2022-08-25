import React, { useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { useTranslation } from 'react-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleRight, faFilePdf, faFolderClosed, faHyphen } from '@fortawesome/pro-light-svg-icons'

// Switch to debug
const showSO = false;
const showID = false;

export const FolderNode = ({
  selected,
  renderItemParams,
  offsetPerLevel,
  handleShow,
  inheritedClasses,
  onSelect,
  ...props
}) => {
  const { t } = useTranslation();
  const { item, onExpand, onCollapse, provided, snapshot } = renderItemParams;

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
    e.preventDefault();
    handleShow(item.data, createFolder);
  };

  return (
    <div 
      className={inheritedClasses}
      onClick={() => item.isExpanded ? onCollapse(item.id) : onExpand(item.id)}
    >
      <span>{getIcon(item, onExpand, onCollapse)}</span>

      {item.data.folder ?
        <DropdownButton
          variant="link"
          title={item.data.folder ? <FontAwesomeIcon className='text-primary' icon={faFolderClosed} /> : <FontAwesomeIcon icon={faFilePdf} />}
          size="sm"
          className='folder-button caret-off me-2'
          style={{display: 'inline'}}
          id="input-group-dropdown-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown.Item href="#" onClick={(e) => handleFolderClick(e)}>{t('general:actions.create-policy.short')}</Dropdown.Item>
          <Dropdown.Item href="#" onClick={(e) => handleFolderClick(e, true)}>{t('general:actions.create-level.short')}</Dropdown.Item>
        </DropdownButton>
        : <></>
      }

      <span className='text-black'>{item.data ? item.data.name : ''}</span>
      
      <Badge bg="canvas-gray text-primary ms-2">
        {levelCategory}
      </Badge>

      {showSO && item.data.sortOrder !== undefined ?
        <Badge className='size-badge round' bg="deep-gray ms-2">{item.data.sortOrder}</Badge> :
        <></>
      }
      {showID ?
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
