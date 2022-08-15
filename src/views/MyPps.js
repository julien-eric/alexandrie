import React, { useState } from 'react'
import { App } from '../App'
import { useTranslation } from 'react-i18next'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'

import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFilter } from '@fortawesome/pro-light-svg-icons';

export const MyPps = ({ ...props }) => {
  const { t } = useTranslation()

  const [filter, setFilter] = useState('')
  const filterPP = (eventFilterInput) => {
    setFilter(eventFilterInput.target.value);
  }

  return (
    <App router={props.router}>
      <PageHeader />
      {/* <GroupInputLH /> */}
      <Form className='col-4 mb-4'>
        <div className='lh-group'>
          <InputGroup className='col-12'>
            <InputGroup.Text id="basic-addon2">
              {/* <ThreeStateIcon icons={{ initial: faCloudArrowUp, loading: faSpinner, final: faCloudCheck }} iconState={loading} /> */}
              <FontAwesomeIcon icon={faSearch}/>
            </InputGroup.Text>
            <FormControl id='alx-nav-search' size='sm' type='text' placeholder={t('menus:headings.search-pps')} className='mr-sm-2' onChange={filterPP}/>
          </InputGroup>
        </div>
      </Form>
      <Row>
        <Col className='tree-root'>
          <Tree filter={filter}/>
        </Col>
      </Row>
    </App>
  )
}

export default MyPps
