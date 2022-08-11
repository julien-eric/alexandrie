import React, { useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { useTranslation } from 'react-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleRight, faFilePdf, faFolder, faFolderClosed, faHyphen } from '@fortawesome/free-solid-svg-icons'

// Switch to debug
const showSO = false;


export const FolderNode = ({
  selected,
  renderItemParams,
  offsetPerLevel,
  handleShow,
  inheritedClasses,
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
      return item.isExpanded ? (
        <Button variant="link" size="sm" onClick={() => onCollapse(item.id)} className='round d-inline text-black' bg="deep-gray">
          <FontAwesomeIcon icon={faAngleDown} />
        </Button>
        ) : (
        <Button variant="link" size="sm" onClick={() => onExpand(item.id)} className='round d-inline text-black' bg="deep-gray">
          <FontAwesomeIcon icon={faAngleRight} />
        </Button>
      );
    } else if (item.data.folder) {
      return (<span className='round d-inline text-black' bg="deep-gray">
        -
        </span>
      )
    }
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
        >
          <Dropdown.Item href="#" onClick={() => handleShow(item.data)}>{t('general:actions.create-policy.short')}</Dropdown.Item>
          <Dropdown.Item href="#" onClick={() => handleShow(item.data, true)}>{t('general:actions.create-level.short')}</Dropdown.Item>
        </DropdownButton>
        : <></>
      }
      <span>{item.data ? item.data.name : ''}</span>
        {item.data.folder ?
          <Badge bg="deep2-gray ms-2">
            {levelCategory}
          </Badge> :
          <></>
        }
        {showSO && item.data.sortOrder !== undefined ?
          <Badge className='size-badge round' bg="deep-gray ms-2">{item.data.sortOrder}</Badge> :
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
