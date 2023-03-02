import React, { useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { useTranslation } from 'react-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faFolderClosed } from '@fortawesome/pro-light-svg-icons'

export const FolderNodeAction = ({
  apiRoute,
  item,
  showDetails,
  ...props
}) => {
  const { t } = useTranslation();

  const actions = apiRoute === 'entries' ? 
    ['create-policy', 'create-level'] :
    ['role-details'];

  return (
    <DropdownButton
      disabled
      variant="link"
      title={apiRoute === 'entries' ? <FontAwesomeIcon className='text-primary' icon={faFolderClosed} /> : <FontAwesomeIcon icon={faBuilding} />}
      size="sm"
      className='folder-button caret-off me-2'
      style={{display: 'inline'}}
      id="input-group-dropdown-1"
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map(
        (action, index) => {
          return(
            <Dropdown.Item href="#" key={index} onClick={(e) => showDetails(item)}>{t(`general:actions.${action}.short`)}</Dropdown.Item>
          )
        }
      )} 
    </DropdownButton>
  );
}

export default FolderNodeAction
