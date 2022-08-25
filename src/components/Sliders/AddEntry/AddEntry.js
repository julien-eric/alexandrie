import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/pro-light-svg-icons';
import Button from 'react-bootstrap/Button'

import EntryBreadCrumb from './Breadcrumb'
import FileUpload from '../../FileUpload/FileUpload.js';

import axios from 'axios'
const poster = (url, body) => axios.post(url, body).then(res => res.data)

export const AddEntry = ({
  location,
  expanded,
  folder,
  handleClose,
  ancestry,  
  parent,
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
    const result = await poster('http://localhost:3000/entries', entry);
    if(result._id) {handleClose()}
  };

  const disabled = !folder && (formData.name === '' || formData.file === '');

  return (
    <div id='righthand' className={`${expanded === true ? 'expanded' : 'collapsed'} px-5`}>
      <div id='righthand-level'>
        <Row className='py-4'>
          <Col className='col-10 d-inline-flex align-items-center'>
            <h3 className='text-black'>
              Ajouter une politique
            </h3>
          </Col>
          <Col className='col-2 d-inline-flex align-items-center'>
            <Button variant='link' onClick={handleClose}>
              <FontAwesomeIcon icon={faX}/>
            </Button>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <Nav
              justify  
              // variant='pull'
              defaultActiveKey={tab}
              className='add-entry mb-3'
              as="ul"
              onSelect={(selectedKey) => {
                  setTab(selectedKey);
                  props.setFolder(selectedKey === 'folder');
                }
              }
            >
              <Nav.Item as="li">
                <Nav.Link eventKey="policy">Politique</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="folder">Répertoire</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form onSubmit={handleSubmit} >
              <Form.Group as={Row} className='mb-3'>
                <Form.Label className='ps-0' htmlFor='inputPassword5'>{t('general:inputs.policy-name.label')}</Form.Label>
                <Form.Control
                  type='text'
                  id='name'
                  aria-describedby='passwordHelpBlock'
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <EntryBreadCrumb
                  folder={folder}
                  item={props.item}
                  ancestry={ancestry || []}
                  newPolicyName={formData.name}
                />
              </Form.Group>

              {!folder && 
                <FileUpload
                  formData={formData}
                  setFormData={setFormData}
                />
              }

              <Row className='mt-5 justify-content-end'>
                <Col className='col-6 text-end me-0 pe-0'>
                  <Button variant='primary' type='submit' size='md' disabled={disabled} className='me-1 d-inline'>Confirmer</Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
      

    </div>)
}

export default AddEntry
