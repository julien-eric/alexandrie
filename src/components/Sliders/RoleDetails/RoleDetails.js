import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

import Button from 'react-bootstrap/Button'
import { buildTokenInfo } from '../../../utils.js'

import { Slider } from '../Slider'
import { LinkedRolesList } from '../RoleDetails'

import axios from 'axios'
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const RoleDetails = ({
  location,
  expanded,
  folder,
  handleClose,
  ancestry,  
  parent,
  setShowPolicySelection,
  ...props
}) => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(folder === true ? 'folder' : 'policy');

  const [formData, setFormData] = useState({
    name: '',
    file: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    let entry = {parent: ancestry[ancestry.length - 1].data._id, ...formData};
    if(folder) entry.folder = true;
    const result = await poster('https://localhost:3000/entries', entry, localStorage.getItem('accessToken'));
    if(result._id) {handleClose()}
  };

  const disabled = !folder && (formData.name === '' || formData.file === '');

  return (
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
                <LinkedRolesList
                  linkedPolicies={[{name: 'Commun : Ressources humaines', count: '12'},
                    {name: 'Anasthésie Générale', count: '18'}
                  ]}
                />
                <Button variant='primary' type='submit' size='md' className='me-1 d-inline' onClick={() => setShowPolicySelection(true)}></Button>
              </Col>
            </Row>

          </Form>
        </Col>
      </Row>
    </Slider>)
}

export default RoleDetails
