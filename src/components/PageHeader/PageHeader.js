import React from 'react'
import './PageHeader.scss'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import Row from 'react-bootstrap/Row'

import Button from 'react-bootstrap/Button'

export const PageHeader = ({
  ...props
}) => {
  const { t } = useTranslation();
  const location = useLocation().pathname;

  let title = location === '/' ? 'my-pps': location.substring(1);

  return (
    <Row className='my-4'>
        <h2 className='col-auto text-black'>
          {t(`general:headings.${title}`)}
        </h2>
    </Row>)
}

export default PageHeader
