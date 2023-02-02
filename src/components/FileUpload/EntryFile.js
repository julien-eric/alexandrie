import React , {useState} from 'react';
import { useTranslation } from 'react-i18next'
import { InputGroup, Form, Row } from 'react-bootstrap';
import FileUpload from './FileUpload';
import Button from 'react-bootstrap/Button';

import { ICON_STATE, ThreeStateIcon } from '../ThreeStateIcon/ThreeStateIcon';
import { faRepeat, faCaretUp } from '@fortawesome/pro-light-svg-icons'

export const EntryFile = ({
  formData,
  setFormData,
  ...props
}) => {

  const { t } = useTranslation()
  const [editingFile, setEditingFile] = useState(ICON_STATE.INITIAL);

  const toggleEditingFileState = (state) => {
    if(state)
      setEditingFile(state);
    if(editingFile === ICON_STATE.INITIAL)
      setEditingFile(ICON_STATE.LOADING);
    if(editingFile === ICON_STATE.LOADING)
      setEditingFile(ICON_STATE.INITIAL);
  }

  const setComplete = () => {
    setEditingFile(ICON_STATE.INITIAL)
  };

  console.log('formData.file', formData.file)
  console.log('formData.file', formData.file === '')
  return (
    <>
    {
      formData.file !== '' && 
      <Row className='mb-3'>
        <Form.Label htmlFor='file-name' className='px-0' >{t('general:messages.file')}</Form.Label>
        <InputGroup className='px-0'>
          <Form.Control
            type="text"
            placeholder={t('general:messages.file')}
            aria-label="Input group example"
            aria-describedby="btnGroupAddon2"
            value={formData.file}
            onChange={()=>{}}
          />
          <Button onClick={toggleEditingFileState}>
            <ThreeStateIcon icons={{ initial: faRepeat, loading: faCaretUp, final: faRepeat }} iconState={editingFile} />
          </Button>
        </InputGroup>
      </Row>
    }
      {
        (editingFile === ICON_STATE.LOADING || formData.file === '') && 
        <FileUpload
          formData={formData}
          setFormData={setFormData}
          setComplete={setComplete}
        />
      }
    </>
  )
}

export default EntryFile;