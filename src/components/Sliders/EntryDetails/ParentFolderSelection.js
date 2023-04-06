import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InputGroup, Form, Row, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faRepeat, faMagnifyingGlass, faX, faCheck } from '@fortawesome/pro-light-svg-icons';
import { ICON_STATE, ThreeStateIcon } from '../../ThreeStateIcon/ThreeStateIcon';

export const ParentFolderSelection = ({
  toggleSelectionMode,
  treeSelectionMode,
  cancelSelection,
  parent,
  ...props
}) => {
  const { t } = useTranslation()
  const iconState = !treeSelectionMode ? ICON_STATE.INITIAL : ICON_STATE.LOADING
  console.log('parent', parent)
  return (
    <Row className='mb-3'>
      <div className='d-grid px-0 gap-2'>
        <Form.Label className='ps-0 mb-0' htmlFor='assign-folder'>{t('general:inputs.assign-folder.label')}</Form.Label>
        <InputGroup className='px-0'>
          <InputGroup.Text id="basic-addon1"><FontAwesomeIcon className='fa-fw me-1' icon={faFolder} /></InputGroup.Text>
          <Form.Control
            type="text"
            disabled
            placeholder={t('general:messages.file')}
            aria-label="Assign Folder Group"
            aria-describedby="assingFolderButtonGroup"
            value={parent && parent.data.name ? parent.data.name : t('general:inputs.assign-folder.placeholder')}
            onChange={()=>{}}
          />
          {
            treeSelectionMode &&
            <Button onClick={toggleSelectionMode}>
              <ThreeStateIcon noSpin={true} icons={{ initial: faMagnifyingGlass, loading: faCheck, final: faRepeat }} iconState={iconState} />
            </Button>
          }
          <Button onClick={cancelSelection}>
            <ThreeStateIcon noSpin={true} icons={{ initial: faMagnifyingGlass, loading: faX, final: faRepeat }} iconState={iconState} />
          </Button>
        </InputGroup>
      </div>
    </Row>
)
}

export default ParentFolderSelection
