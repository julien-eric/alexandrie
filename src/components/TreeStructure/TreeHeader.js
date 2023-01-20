import React from 'react'
import { useTranslation } from 'react-i18next'

import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faClose, faArrowsToDottedLine, faArrowsFromDottedLine, faUserCheck } from '@fortawesome/pro-light-svg-icons';

export const TreeHeader = ({ filter, setFilter, collapseAll, expandAll, nodeSelectionMode, fetchPersonalPolicies, setFetchPersonalPolicies, ...props }) => {
  const { t } = useTranslation()

  const filterPP = (eventFilterInput) => {
    setFilter(eventFilterInput.target.value);
  }

  const toggleShowUserPolicies = () => {
    setFetchPersonalPolicies(!fetchPersonalPolicies);
  }

  return (
    <Row className='mb-4'>
      {
        nodeSelectionMode ? 
          <Button onClick={toggleShowUserPolicies} variant={fetchPersonalPolicies ? 'primary' : 'canvas-gray'} size='sm' className='col-auto px-3 ms-2 '>
            <FontAwesomeIcon className='fa-fw' icon={faUserCheck}/>
          </Button>
        :<></>
      }
      <Form className='col-4'>
        <div className='lh-group'>
          <InputGroup className='col-12'>
            <InputGroup.Text id="basic-addon2">
              <FontAwesomeIcon icon={faSearch}/>
            </InputGroup.Text>
            <FormControl id='alx-nav-search' size='sm' type='text' value={filter} placeholder={t('menus:headings.search-pps')} className='mr-sm-2' onChange={filterPP}/>
            <InputGroup.Text className='append-no-p' id="basic-addon3">
              <Button variant='link' size='sm' className='round' onClick={() => { setFilter('') }}>
                <FontAwesomeIcon icon={faClose} />
              </Button>
            </InputGroup.Text>
          </InputGroup>
        </div>
      </Form>
        <ButtonGroup aria-label="Basic example" className='col-auto px-3'>
          <Button onClick={collapseAll} variant='canvas-gray' size='sm' className='px-3'>
            <FontAwesomeIcon className='fa-fw' icon={faArrowsToDottedLine}/>
          </Button>
          <Button onClick={expandAll} variant='canvas-gray' size='sm' className='px-3'>
            <FontAwesomeIcon className='fa-fw' icon={faArrowsFromDottedLine}/>
          </Button>
        </ButtonGroup>
    </Row>
  )
}

export default TreeHeader
