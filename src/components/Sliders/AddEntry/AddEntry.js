import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Nav, InputGroup, Form, Row, Col, Button } from 'react-bootstrap';

import { buildTokenInfo } from '../../../utils.js'
import { useSWRConfig }  from 'swr'

import './AddEntry.scss'

import { Slider } from '../Slider'
import EntryFile from '../../FileUpload/EntryFile.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faRepeat, faMagnifyingGlass, faX } from '@fortawesome/pro-light-svg-icons';
import { ICON_STATE, ThreeStateIcon } from '../../ThreeStateIcon/ThreeStateIcon';

import axios from 'axios'
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const AddEntry = ({
  item,
  location,
  expanded,
  setExpanded,
  isFolder,
  setIsFolder,
  ancestry,  
  setItemDetails,
  treeSelectionMode,
  setTreeSelectionMode,
  parent,
  ...props
}) => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(isFolder === true ? 'folder' : 'policy');
  const [formData, setFormData] = useState({})
  const { mutate } = useSWRConfig();

  useEffect(() => {
    setFormData({
      name: item !== undefined ? item.data.name : '',
      file: item && item.data.files && item.data.files.length > 0 ? item.data.files[0] : '',
      parent: parent && parent.data._id ? parent.data._id : undefined,
    })
  }, [item, parent]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let entry = {...formData};
    if(isFolder) entry.folder = true;
    const entryId = item && item.data._id ? `/${item.data._id}` : ''
    const result = await poster(`https://localhost:3000/entries${entryId}`, entry, localStorage.getItem('accessToken'));
    if(result._id) {handleClose()}
  };
  
  const handleClose = async () => {
    // TODO : Tree should take in a url like https://localhost:3000/entries?user=true&folders=true, and parse the params from it. This would allow for
    // mutating the right url.
    mutate([`https://localhost:3000/entries`, localStorage.getItem('accessToken')], false)
    mutate([`https://localhost:3000/entries?user=true`, localStorage.getItem('accessToken')], false)
    setIsFolder(false);
    setExpanded(false);
    setItemDetails();
    setTreeSelectionMode(false);
    setFormData({
      name: '',
      file: '',
      parent: ''
    });

  };

  const toggleSelectionMode = () => {
    setTreeSelectionMode(!treeSelectionMode);
  }

  const disabled = (!isFolder && (formData.name === '' || formData.file === '')) || treeSelectionMode;

  const title = item && item.data ? item.data.name : t('general:messages.add-policy');

  const iconState = !treeSelectionMode ? ICON_STATE.INITIAL : ICON_STATE.LOADING

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
                  setIsFolder(selectedKey === 'folder');
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
                <InputGroup className='px-0'>
                  <InputGroup.Text id="basic-addon1"><FontAwesomeIcon className='fa-fw me-1' icon={faFolder} /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={t('general:messages.file')}
                    aria-label="Input group example"
                    aria-describedby="btnGroupAddon2"
                    value={parent && parent.data.name ? parent.data.name : t('general:inputs.assign-folder.placeholder')}
                    onChange={()=>{}}
                  />
                  <Button onClick={toggleSelectionMode}>
                    <ThreeStateIcon noSpin={true} icons={{ initial: faMagnifyingGlass, loading: faX, final: faRepeat }} iconState={iconState} />
                  </Button>
                </InputGroup>
              </div>
            </Row>

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
