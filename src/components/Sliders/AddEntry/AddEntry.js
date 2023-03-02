import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Nav, Form, Row, Col, Button } from 'react-bootstrap';

import { buildTokenInfo } from '../../../utils.js'
import { useSWRConfig }  from 'swr'

import './AddEntry.scss'

import { Slider } from '../Slider'
import EntryFile from '../../FileUpload/EntryFile.js';

import axios from 'axios'
import ParentFolderSelection from './ParentFolderSelection.js';
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const AddEntry = ({
  item,
  location,
  expanded,
  setExpanded,
  treeSelectionMode,
  setTreeSelectionMode,
  parent,
  setParent,
  ...props
}) => {
  const { t } = useTranslation()
  const [isFolder, setIsFolder] = useState();
  const [originalParent, setOriginalParent] = useState(parent);
  const [formData, setFormData] = useState({
    _id: item && item.data ? item.data._id : '',
    file:'',
    name: item && item.data ? item.data.name : '',
    parent: item && item.data && item.data.parent ? item.data.parent : '',
  })
  const { mutate } = useSWRConfig();

  useEffect(() => {
    setFormData({
      ...formData,
      name: formData.name ? formData.name : item !== undefined ? item.data.name : '',
      file: item && item.data.files && item.data.files.length > 0 ? item.data.files[0] : '',
      parent: parent && parent.data._id ? parent.data._id : undefined
    })
  }, [parent, item]);

  useEffect(() => {
    setIsFolder(item && item.data && item.data.folder ? true : false)
  }, [item]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let entry = {...formData};
    if(isFolder) entry.folder = true;
    const result = await poster(`https://localhost:3000/entries`, entry, localStorage.getItem('accessToken'));
    if(result._id) {handleClose()}
  };
  
  const handleClose = async () => {
    mutate([`https://localhost:3000/entries`, localStorage.getItem('accessToken')], false)
    mutate([`https://localhost:3000/entries?user=true`, localStorage.getItem('accessToken')], false)
    setIsFolder(false);
    setParent();
    setExpanded(false);
    setTreeSelectionMode(false);
    setFormData({
      name: '',
      file: '',
      parent: ''
    });

  };

  const toggleSelectionMode = () => {
    setTreeSelectionMode(!treeSelectionMode);
    setOriginalParent(parent);
  }

  const cancelSelection = () => {
    setParent(originalParent)
    setTreeSelectionMode(!treeSelectionMode);
  }

  const title = item && item.data ? item.data.name : 
    isFolder ? t('general:messages.add-folder') : t('general:messages.add-policy');

  const disabled = (!isFolder && ((!formData.name || formData.name === '') || (!formData.file || formData.file === ''))) || treeSelectionMode;

  return (
    <Slider expanded={expanded} handleClose={handleClose} title={title}>
      {
        <Row>
          <Col className='px-0'>
            <Nav
              justify  
              variant='pills'
              defaultActiveKey={isFolder === true ? 'folder' : 'policy'}
              activeKey={isFolder === true ? 'folder' : 'policy'}
              className='add-entry mb-3'
              as="ul"
              onSelect={(selectedKey) => {
                  setIsFolder(selectedKey === 'folder');
                }
              }
            >
              <Nav.Item as="li">
                <Nav.Link disabled={!!item} eventKey="policy">{t('general:messages.policy')}</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link disabled={!!item} eventKey="folder">{t('general:messages.folder')}</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      }

      <Row>
        <Col>
          <Form onSubmit={handleSubmit} >
            <Form.Group as={Row} className='mb-3'>
              <Form.Label className='ps-0' htmlFor='title'>{t('general:inputs.policy-name.label')}</Form.Label>
              <Form.Control
                type='text'
                id='name'
                aria-describedby='title'
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Form.Group>

            <ParentFolderSelection
              treeSelectionMode={treeSelectionMode}
              toggleSelectionMode={toggleSelectionMode}
              cancelSelection={cancelSelection}
              parent={parent}
            />

            {!isFolder && 
              <EntryFile 
                formData={formData}
                setFormData={setFormData}
              />
            }

            <Row className='mt-5 justify-content-end'>
              <Col className='col-6 text-end me-0 pe-0'>
                <Button variant='primary' type='submit' size='md' disabled={disabled} className='me-1 d-inline'>
                  {t('general:messages.confirm')}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Slider>)
}

export default AddEntry
