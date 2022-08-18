import React, { useState } from 'react'
import { App } from '../App'
import { useTranslation } from 'react-i18next'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'

import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFilter, faClose, faArrowsToDottedLine } from '@fortawesome/pro-light-svg-icons';

export const MyPps = ({ ...props }) => {
  const { t } = useTranslation()

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
