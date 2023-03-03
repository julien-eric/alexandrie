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
const fetcher = (url, token) => axios.get(url, buildTokenInfo(token)).then(res => res.data);
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const RoleDetails = ({
  location,
  handleClose,
  roleId,
  ...props
}) => {
  const { t } = useTranslation()
  const [showPolicySelection, setShowPolicySelection] = useState(false);
  const [role, setRole] = useState();
  const apiRoute = 'entries';
  const [formData, setFormData] = useState({})
  const token = localStorage.getItem('accessToken');
  
  const { mutate } = useSWRConfig()

  const useRole = () => {
    const { data, error } = useSWR(token !== undefined ? [`https://localhost:3000/roles/${roleId}`, token] : null, fetcher);
    return { roleData: data, roleError: error }
  }

  const useSubbedEntries = () => {
    const { data, error } = useSWR(token !== undefined ? [`https://localhost:3000/entries?role=${roleId}`, token] : null, fetcher);
    return { subbedEntries: data, subbedEntriesError: error }
  }
  
  const { roleData, roleError } = useRole()
  const { subbedEntries, subbedEntriesError } = useSubbedEntries()

  useEffect(() => {
    if(role) {
      setFormData({
        name: role && role.data ? role.data.name : ''
      })
    }
  }, [role]);
  
  useEffect(() => {
    if(roleData) {
      setRole({id:roleData._id, data:roleData})
    }
  }, [roleData]);


  const reduceItems = (items, onlyIds) => {
    if(!items || items.length === 0)
      return []
    if(items['1']) delete items['1'];
    const roleAffectedPolicies = [];
    for (const [id, entry] of Object.entries(items)) {
      roleAffectedPolicies.push(onlyIds ? entry.id : entry.data)
    }
    return roleAffectedPolicies;
  }

  const togglePolicySelection = (show) => {
    if(show) {
      setShowPolicySelection(true);
    } else {
      setShowPolicySelection(false);
      mutate([`https://localhost:3000/${apiRoute}?role=${role._id}`, token], false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let roleInfo = {
      name: formData ? formData.name : role ? role.name : ''
    };
    const result = await poster(`https://localhost:3000/roles/${role.id}`, { role: roleInfo }, localStorage.getItem('accessToken'));
    if(result._id) {handleClose()}
  };

  return (
    <>
      { showPolicySelection ? 
        <PolicySelection
          show={!!showPolicySelection}
          togglePolicySelection={togglePolicySelection}
          role={role}
          rolePolicies={reduceItems(subbedEntries.items, true)}
        /> : <></>
      }
      <Slider expanded={!!roleId} handleClose={handleClose} title={'Role Details'}>

        <Form onSubmit={handleSubmit} >
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
