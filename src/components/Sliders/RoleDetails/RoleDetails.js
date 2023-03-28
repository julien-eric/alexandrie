import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

import Button from 'react-bootstrap/Button'
import { buildTokenInfo } from '../../../utils.js'

import { Slider } from '../Slider'
import useSWR, { useSWRConfig }  from 'swr'
import { PolicySelection } from '../PolicySelection/PolicySelection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/pro-light-svg-icons';

import axios from 'axios'
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const RoleDetails = ({
  location,
  handleClose,
  handleSubmit,
  role,
  rolePolicies,
  ...props
}) => {
  const { t } = useTranslation()
  const [showPolicySelection, setShowPolicySelection] = useState(false);
  const apiRoute = 'entries';
  const [formData, setFormData] = useState({
    name: role && role.data ? role.data.name : ''
  })
  const token = localStorage.getItem('accessToken');
  
  const { mutate } = useSWRConfig()

  const togglePolicySelection = (show) => {
    if(show) {
      setShowPolicySelection(true);
    } else {
      setShowPolicySelection(false);
      mutate([`https://localhost:3000/${apiRoute}?role=${role._id}`, token], false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    handleSubmit(formData)
  };

  return (
    <>
      { showPolicySelection ? 
        <PolicySelection
          show={!!showPolicySelection}
          togglePolicySelection={togglePolicySelection}
          role={role}
          rolePolicies={rolePolicies}
        /> : <></>
      }
      <Slider expanded={true} handleClose={handleClose} title={'Role Details'}>

        <Form onSubmit={onSubmit} >
          <Row>
            <Col>
              <Form.Group className='mb-3'>
                <Form.Label className='ps-0' htmlFor='inputPassword5'>{t('general:inputs.policy-name.label')}</Form.Label>
                <Form.Control
                  type='text'
                  id='name'
                  aria-describedby='passwordHelpBlock'
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
              </Form.Group>
            </Col>
          </Row>

          <Row className=''>
            <Col as={'div'} className='d-grid col-12'>
              <Form.Label className='ps-0' htmlFor='inputPassword5'>{t('general:messages.policies')}</Form.Label>
              <Button variant='deep-gray' size='md' className='' onClick={() => setShowPolicySelection(true)}>
                <FontAwesomeIcon className='fa-fw me-1' icon={faEye} />
                {t('general:messages.display-policies')}
              </Button>
            </Col>
          </Row>

          <Row className='mt-5 justify-content-end'>
            <Col className='col-6 text-end me-0 pe-0'>
              <Button variant='primary' type='submit' size='md' className='me-1 d-inline'>{t('general:messages.confirm')}</Button>
            </Col>
          </Row>

        </Form>
      </Slider>
    </>)
}

export default RoleDetails
