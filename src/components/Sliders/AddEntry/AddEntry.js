import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './AddEntry.scss'

import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import EntryBreadCrumb from './Breadcrumb'
import FileUpload from '../../FileUpload/FileUpload.js';

import axios from 'axios'
const poster = (url, body) => axios.post(url, body).then(res => res.data)

export const AddEntry = ({
  location,
  ...props
}) => {
  const { t } = useTranslation()
  const folder = props.folder;
  const [tab, setTab] = useState(folder === true ? 'folder' : 'policy');

  const [formData, setFormData] = useState({
    name: '',
    file: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    let entry = {parent: props.item._id, ...formData};
    if(folder) entry.folder = true;
    const result = await poster('http://localhost:3000/entries', entry);
    if(result._id) {props.handleClose()}
  };

  const disabled = !folder && (formData.name === '' || formData.file === '');

  return (
    <>
      <Row>
        <Nav
          justify  
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
      </Row>

      <Form onSubmit={handleSubmit} >
        <Form.Group as={Row} className='mb-3'>
          <Form.Label htmlFor='inputPassword5'>{t('general:inputs.policy-name.label')}</Form.Label>
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
            tree={props.tree}
            newPolicyName={formData.name}
          />
        </Form.Group>

        {!folder && 
          <FileUpload
            formData={formData}
            setFormData={setFormData}
          />
        }

        <Row className='mt-5'>
          <Col className='col-6'>
            <Row>
              <Button type='submit' disabled={disabled}>Confirmer</Button>
            </Row>
          </Col>
          <Col className='col-6'>
            <Row>
              <Button type='submit' variant='outline-primary'>Annuler</Button>
            </Row>
          </Col>
        </Row>
      </Form>
    </>)
}

export default AddEntry
