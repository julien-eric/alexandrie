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
import { faAdd, faGlobe, faSearch, faClose, faArrowsToDottedLine, faArrowsFromDottedLine, faUserCheck } from '@fortawesome/pro-light-svg-icons';
import ReadFilter from './ReadFilter'

export const TreeHeader = ({ 
  apiRoute,
  filter,
  setFilter,
  readFilter,
  setReadFilter,
  collapseAll,
  expandAll,
  showEntryDetails,
  setSelected,
  selectMode,
  fetchPersonalPolicies,
  setFetchPersonalPolicies,
  onCreate,
  ...props
}) => {
  const { t } = useTranslation()

  const filterPP = (eventFilterInput) => {
    setFilter(eventFilterInput.target.value);
  }

  const toggleShowUserPolicies = () => {
    setFetchPersonalPolicies(!fetchPersonalPolicies);
  }

  const onClickCreate = () => {
    if(onCreate) {
      onCreate()
    } else {
      setSelected([]);
      showEntryDetails()
    }
  }

  return (
    <Row className='mb-4'>
      {
        apiRoute === 'entries' && !selectMode ? 
          <Button onClick={toggleShowUserPolicies} variant={fetchPersonalPolicies ? 'canvas-gray' : 'canvas-gray'} size='sm' className='col-auto px-3 ms-2 '>
            <FontAwesomeIcon className='fa-fw me-2' icon={fetchPersonalPolicies ? faUserCheck : faGlobe}/>
            {fetchPersonalPolicies ? t('general:messages.my-policies') : t('general:messages.all-policies') }
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
        { apiRoute === 'entries' && !selectMode &&
          <>
            <ButtonGroup aria-label="Basic example" className='col-auto ps-1 pe-3'>
              <Button onClick={collapseAll} variant='canvas-gray' size='sm' className='px-3'>
                <FontAwesomeIcon className='fa-fw' icon={faArrowsToDottedLine}/>
              </Button>
              <Button onClick={expandAll} variant='canvas-gray' size='sm' className='px-3'>
                <FontAwesomeIcon className='fa-fw' icon={faArrowsFromDottedLine}/>
              </Button>
            </ButtonGroup>
            <ReadFilter readFilter={readFilter} setReadFilter={setReadFilter}  className='me-auto'/>
          </>
        }
        {
          !selectMode && 
          <Button variant='canvas-gray' size='sm' className='col-auto py-0 my-0 px-3 col-auto' onClick={onClickCreate}>
            <FontAwesomeIcon className='fa-fw me-1' icon={faAdd} />
            {t('general:messages.create')}
          </Button>
        }
    </Row>
  )
}

export default TreeHeader
