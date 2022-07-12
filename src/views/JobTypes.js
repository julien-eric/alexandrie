import React from 'react'
import { App } from '../App'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '../components/PageHeader'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export const JobTypes = ({ ...props }) => {
  const { t } = useTranslation()

  return (
    <App router={props.router}>
      <PageHeader />
      <Row>
        {/* <Col>
          <Button icon='comments' onClick={handleSimpleAction}>{t('general:headings.welcome')}</Button>
        </Col> */}
      </Row>
    </App>
  )
}

export default JobTypes
