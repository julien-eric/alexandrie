import React from 'react'
import { App } from '../App'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'

export const MyPps = ({ ...props }) => {
  // const { t } = useTranslation()
  // const handleSimpleAction = props.simpleAction

  return (
    <App router={props.router}>
      <PageHeader />
      <Row>
        <Col>
          <Tree />
        </Col>
      </Row>
    </App>
  )
}

export default MyPps
