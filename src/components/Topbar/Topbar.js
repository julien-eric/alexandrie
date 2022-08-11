import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import { useTranslation } from 'react-i18next'
import './topbar.scss'

export const Topbar = ({
  ...props
}) => {
  const { t } = useTranslation()

  const filterPP = () => {
    
  }

  return (
    <Navbar bg='light' expand='lg' className='alx sticky-top'>
      <Navbar.Brand className='ms-3' href='#home2'>ALEXANDRIE</Navbar.Brand>
      {/* <Navbar.Brand href='#home' className='ms-3 me-3'>
        <img
          src='/logo.svg'
          width='30'
          height='30'
          className='d-inline-block align-top'
          alt='React Bootstrap logo'
        />
      </Navbar.Brand> */}
      <Form className='ms-5 col-7'>
        <InputGroup className='col-8'>
          <InputGroup.Text><i className='fas fa-search' /></InputGroup.Text>
          <FormControl id='alx-nav-search' size='lg' type='text' placeholder={t('menus:headings.search-pps')} className='mr-sm-2' onChange={filterPP}/>
        </InputGroup>
      </Form>
    </Navbar>)
}

export default Topbar
