import React, { useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Badge from 'react-bootstrap/Badge'
import { useTranslation } from 'react-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFolder, faFolderClosed } from '@fortawesome/free-solid-svg-icons'

export const TreeTitle = ({
  router,
  data,
  fetchedData,
  selected,
  nodeCreation,
  setNodeCreation,
  ...props
}) => {
  const { t } = useTranslation();

  const folderCategory = (level) => {
    if(level == 0) return 'Service';
    if(level == 1) return 'Département';
    if(level == 2) return 'Unité';
    if(level === undefined) return undefined
  } 

  const findNode = (data, id) => {
    function iter(a) {
        if (a._id === id) {
            result = a;
            return true;
        }
        return Array.isArray(a.children) && a.children.some(iter);
    }
    var result;
    data.some(iter);
    return result;
  }

  const findBySequence = (data, sequence) => {
    let dataLevel = data;
    let element = {};

    sequence.forEach((index) => {
      if(!dataLevel[index]) {
        return -1;
      }

      element = dataLevel[index];
      dataLevel = element.children;
    });
    console.log('element', element);
  }

  const createNewNode = (item, folder) => {
    item.showAddEntry(folder);
  }

  return (
    <span>
      <DropdownButton
        variant="outline-secondary"
        title={data.dataRef.folder ? <FontAwesomeIcon className='text-primary' icon={faFolderClosed} /> : <FontAwesomeIcon icon={faFilePdf} />}
        size="sm"
        className='folder-button'
        style={{display: 'inline'}}
        id="input-group-dropdown-1"
      >
        <Dropdown.Item href="#" onClick={() => createNewNode(data.dataRef)}>{t('general:actions.create-policy.short')}</Dropdown.Item>
        <Dropdown.Item href="#" onClick={() => createNewNode(data.dataRef, true)}>{t('general:actions.create-level.short')}</Dropdown.Item>
      </DropdownButton>
      
      {data.dataRef.folder && data.dataRef.level !== undefined ?
        <Badge bg="primary me-2">
          {folderCategory(data.dataRef.level)}
        </Badge> :
        <></>
      }
      {data.title}
      {data.size == 0 || data.size ?
        <Badge className='round' bg="deep-gray ms-2">{data.size}</Badge> :
        <></>
      }
    </span>
  );
}

export default TreeTitle
