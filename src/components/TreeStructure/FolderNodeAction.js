import React, { useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { useTranslation } from 'react-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faFolderClosed } from '@fortawesome/pro-light-svg-icons'

export const FolderNodeAction = ({
  apiRoute,
  handleFolderClick,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <DropdownButton
      variant="link"
      title={apiRoute === 'entries' ? <FontAwesomeIcon className='text-primary' icon={faFolderClosed} /> : <FontAwesomeIcon icon={faBuilding} />}
      size="sm"
      className='folder-button caret-off me-2'
      style={{display: 'inline'}}
      id="input-group-dropdown-1"
      onClick={(e) => e.stopPropagation()}
    >
      <Dropdown.Item href="#" onClick={(e) => handleFolderClick(e)}>{t('general:actions.create-policy.short')}</Dropdown.Item>
      <Dropdown.Item href="#" onClick={(e) => handleFolderClick(e, true)}>{t('general:actions.create-level.short')}</Dropdown.Item>
    </DropdownButton>
  );
}

export default FolderNodeAction
