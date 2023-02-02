import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'

import Button from 'react-bootstrap/Button'
import { buildTokenInfo } from '../../../utils.js'

import './AddEntry.scss'

import { Slider } from '../Slider'
import EntryFile from '../../FileUpload/EntryFile.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/pro-light-svg-icons';

import axios from 'axios'
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const AddEntry = ({
  item,
  location,
  expanded,
  setExpanded,
  folder,
  setFolder,
  ancestry,  
  setItemDetails,
  treeSelectionMode,
  setTreeSelectionMode,
  parent,
  ...props
}) => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(folder === true ? 'folder' : 'policy');
  const [formData, setFormData] = useState({})

  useEffect(() => {
    setFormData({
      name: item !== undefined ? item.data.name : '',
      file: item && item.data.files.length > 0 ? item.data.files[0] : ''
    })
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let entry = {parent: ancestry[ancestry.length - 1].data._id, ...formData};
    if(folder) entry.folder = true;
    const result = await poster('https://localhost:3000/entries', entry, localStorage.getItem('accessToken'));
    if(result._id) {handleClose()}
  };
  
  const handleClose = async () => {
    // mutate([`https://localhost:3000/${apiRoute}?role=${role._id}`, localStorage.getItem('accessToken')], false)
    setFolder(false);
    setExpanded(false);
    setItemDetails();
    setFormData({
      name: '',
      file: ''
    });

  };

  const toggleSelectionMode = () => {
    setTreeSelectionMode(!treeSelectionMode);
  }

  const disabled = !folder && (formData.name === '' || formData.file === '');

  const title = item && item.data ? item.data.name : t('general:messages.add-policy');

  return (
    <Slider expanded={expanded} handleClose={handleClose} title={title}>

      {
        !item &&
        <Row>
          <Col>
            <Nav
              justify  
              variant='pull'
              defaultActiveKey={tab}
              className='add-entry mb-3'
              as="ul"
              onSelect={(selectedKey) => {
                  setTab(selectedKey);
                  setFolder(selectedKey === 'folder');
                }
              }
            >
              <Nav.Item as="li">
                <Nav.Link eventKey="policy">{t('general:messages.policy')}</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="folder">{t('general:messages.folder')}</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      }

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
            </Form.Group>

            <Row className='mb-3'>
              <div className='d-grid px-0 gap-2'>
                <Form.Label className='ps-0 mb-0' htmlFor='inputPassword5'>{t('general:inputs.assign-folder.label')}</Form.Label>
                <Button variant='deep-gray' size='md' className='' onClick={toggleSelectionMode}>
                  <FontAwesomeIcon className='fa-fw me-1' icon={faMagnifyingGlass} />
                  {t('general:inputs.assign-folder.placeholder')}
                </Button>  
              </div>
            </Row>


            {!folder && 
              <EntryFile 
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
    </Slider>)
}

export default AddEntry
