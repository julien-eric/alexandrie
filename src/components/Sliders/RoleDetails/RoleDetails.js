import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

import Button from 'react-bootstrap/Button'
import { buildTokenInfo } from '../../../utils.js'

import { Slider } from '../Slider'
import { LinkedRolesList } from '../RoleDetails'
import useSWR  from 'swr'
import { PolicySelection } from '../PolicySelection/PolicySelection'

import axios from 'axios'
const fetcher = (url, token) => axios.get(url, buildTokenInfo(token)).then(res => res.data);
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const RoleDetails = ({
  location,
  expanded,
  folder,
  handleClose,
  ancestry,  
  role,
  parent,
  ...props
}) => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(folder === true ? 'folder' : 'policy');
  const [showPolicySelection, setShowPolicySelection] = useState(false);
  const token = localStorage.getItem('accessToken');
  const apiRoute = 'entries';

  const [formData, setFormData] = useState({
    name: '',
    file: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handlesubmit roledetails')
    let entry = {parent: ancestry[ancestry.length - 1].data._id, ...formData};
    if(folder) entry.folder = true;
    const result = await poster('https://localhost:3000/entries', entry, localStorage.getItem('accessToken'));
    if(result._id) {handleClose()}
  };

  const disabled = !folder && (formData.name === '' || formData.file === '');

  const { data, error } = useSWR(token !== undefined ? [`https://localhost:3000/${apiRoute}?role=${role._id}`, token] : null, fetcher);
  
  const reduceItems = (items, onlyIds) => {
    if(items['1']) delete items['1'];
    const roleAffectedPolicies = [];
    for (const [id, entry] of Object.entries(items)) {
      roleAffectedPolicies.push(onlyIds ? entry.id : entry.data)
    }
    return roleAffectedPolicies;
  }
  return (
    <>
      { showPolicySelection ? 
        <PolicySelection
          show={!!showPolicySelection}
          setShowPolicySelection={setShowPolicySelection}
          role={role}
          rolePolicies={reduceItems(data.items, true)}
        /> : <></>
      }
      <Slider expanded={expanded} handleClose={handleClose} title={'Role Details'}>

        <Row>
          <Col>
            <Form onSubmit={handleSubmit} >

              <Form.Group as={Row} className='mb-3'>
                <Form.Label className='ps-0' htmlFor='inputPassword5'>{t('general:inputs.policy-name.label')}</Form.Label>
                <Form.Control
                  type='text'
                  id='name'
                  aria-describedby='passwordHelpBlock'
                  value={ancestry[0] ? ancestry[0].data.name : ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </Form.Group>

              <Row className=''>
                <Col className='col-12'>
                  {
                    data ?
                    <LinkedRolesList
                      linkedPolicies={reduceItems(data.items, false)}
                    /> : <></>
                  }
                  <Button variant='primary' size='md' className='mt-2 me-1 d-inline' onClick={() => setShowPolicySelection(true)}>{t('menus:actions.link-policies')}</Button>
                </Col>
              </Row>

            </Form>
          </Col>
        </Row>
      </Slider>
    </>)
}

export default RoleDetails
