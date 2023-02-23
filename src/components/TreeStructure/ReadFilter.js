import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBadgeCheck as faHollowCheck, faBadge } from '@fortawesome/pro-light-svg-icons'
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons'

export const ReadFilter = ({ 
  readFilter,
  setReadFilter,
  ...props
}) => {
  const { t } = useTranslation()

  const getIcon = () => {
    if (readFilter === ICON_STATE.ALL) return faHollowCheck
    if (readFilter === ICON_STATE.UNREAD) return faBadge
    if (readFilter === ICON_STATE.READ) return faBadgeCheck
  }

  const onClick = () => {
    switch (readFilter) {

      case ICON_STATE.ALL:
        //Change message next to button
        setReadFilter(ICON_STATE.UNREAD);
        break;
        
      case ICON_STATE.UNREAD:
        setReadFilter(ICON_STATE.READ);
        break;
        
      case ICON_STATE.READ:
        setReadFilter(ICON_STATE.ALL);
        break;
    
      default:
        break;
    }
    
  }

  return (
    <ButtonGroup aria-label="Basic example" className='col-auto ps-1 pe-3'>
      <Button onClick={onClick} variant={readFilter !==  ICON_STATE.ALL ? 'primary' : 'canvas-gray'} size='sm' className='px-3'>
        <FontAwesomeIcon className={readFilter === ICON_STATE.ALL ? 'text-deep-gray me-2' : 'me-2'} icon={getIcon()} />
        {readFilter === ICON_STATE.ALL ? t('general:messages.no-read-filter') : null}
        {readFilter === ICON_STATE.UNREAD ? t('general:messages.unread-filter') : null}
        {readFilter === ICON_STATE.READ ? t('general:messages.read-filter') : null}
      </Button>
    </ButtonGroup>
  )
}

export const ICON_STATE = {
  ALL : 0,
  UNREAD : 1,
  READ : 2
}

export default ReadFilter
