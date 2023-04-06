import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Nav, Form, Row, Col, Button } from 'react-bootstrap';

import { buildTokenInfo } from '../../../utils.js'
import { useSWRConfig }  from 'swr'

import './EntryDetails.scss'

import { Slider } from '../Slider'
import EntryFile from '../../FileUpload/EntryFile.js';

import axios from 'axios'
import ParentFolderSelection from './ParentFolderSelection.js';
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const EntryDetails = ({
  entry,
  treeSelectionMode,
  setTreeSelectionMode,
  parent,
  setParent,
  handleSubmit,
  handleClose,
  ...props
}) => {
  const { t } = useTranslation()
  const [isFolder, setIsFolder] = useState(entry && entry.data ? entry.data.folder : '');
  const [originalParent, setOriginalParent] = useState(parent);
  const [formData, setFormData] = useState({
    _id: entry && entry.data ? entry.data._id : '',
    file:'',
    name: entry && entry.data ? entry.data.name : '',
    folder: isFolder,
    parent: entry && entry.data && entry.data.parent ? entry.data.parent : '',
  })
  const { mutate } = useSWRConfig();

  useEffect(() => {
    setFormData({
      ...formData,
      name: formData.name ? formData.name : entry !== undefined ? entry.data.name : '',
      folder: isFolder,
      file: entry && entry.data.files && entry.data.files.length > 0 ? entry.data.files[0] : '',
      parent: parent && parent.data._id ? parent.data._id : undefined
    })
  }, [parent, entry]);

  useEffect(() => {
    setIsFolder(entry && entry.data && entry.data.folder ? true : false)
  }, [entry]);
  
  const onSubmit = async (e) => {
    e.preventDefault()
    handleSubmit(formData)
  };
  
  const toggleSelectionMode = () => {
    setTreeSelectionMode(!treeSelectionMode);
    setOriginalParent(parent);
  }

  const cancelSelection = () => {
    setParent(originalParent)
    setTreeSelectionMode(!treeSelectionMode);
  }

  const title = entry && entry.data ? entry.data.name : 
    isFolder ? t('general:messages.add-folder') : t('general:messages.add-policy');

  const disabled = (!isFolder && ((!formData.name || formData.name === '') || (!formData.file || formData.file === ''))) || treeSelectionMode;

  return (
    <Slider expanded={true} handleClose={handleClose} title={title}>
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
                <Nav.Link disabled={!!entry} eventKey="policy">{t('general:messages.policy')}</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link disabled={!!entry} eventKey="folder">{t('general:messages.folder')}</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      }

      <Row>
        <Col>
          <Form onSubmit={onSubmit} >
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

export default EntryDetails
