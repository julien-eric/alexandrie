import React, { useState } from 'react'
import { App } from '../App'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'

export const MyPps = ({ ...props }) => {

  return (
    <App router={props.router}>
      <PageHeader />
      <Row className='mt-4'>
        <Col className='tree-root'>
          <Tree/>
        </Col>
      </Row>
    </App>
  )
}

export default MyPps
