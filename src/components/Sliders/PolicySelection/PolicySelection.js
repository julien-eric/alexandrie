import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container'
import { useTranslation } from 'react-i18next'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';

import { Tree } from '../../TreeStructure'
import { buildTokenInfo } from '../../../utils.js'

import './PolicySelection.scss'

import useSWR, { useSWRConfig }  from 'swr'
import axios from 'axios'
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const PolicySelection = ({
  show,
  role,
  rolePolicies,
  togglePolicySelection,
  ...props
}) => {
  const { t } = useTranslation();
  const [originalEntries, setOriginalEntries] = useState(rolePolicies || []);
  const [selected, setSelected] = useState(rolePolicies || []);
  const [changeCount, setChangeCount] = useState([]);
  const { mutate } = useSWRConfig()

  const handleClose = () => {
    togglePolicySelection(false);
    mutate([`https://localhost:3000/entries`, localStorage.getItem('accessToken')], false)
  }

  const applyNewPolicies = async (e) => {
    const result = await poster(`https://localhost:3000/roles/${role.id}/entries`, {entryIds: selected }, localStorage.getItem('accessToken'));
    if(result.acknowledged) {
      handleClose();
    }
  }

  useEffect(() => {
    if(originalEntries === selected) {
      setChangeCount(0)
    } else {
      const newElements = selected.filter((entry) => {
        return originalEntries.indexOf(entry) === -1;
      });
      const removedElements = originalEntries.filter((entry) => {
        return selected.indexOf(entry) === -1;
      });
      setChangeCount(newElements.length + removedElements.length);
    }
  }, [selected, originalEntries]);

  return (
    <>
      <Modal show={show} onHide={handleClose} className='modal-bg policy-selection-modal'>
        <Modal.Header closeButton>
         {t('general:headings.linking-policy-modal-header') + ' ' + role && role ? role.data.name : '' }
        </Modal.Header>
        <Modal.Body className=''>
          <Tree 
            apiRoute={'entries'}
            selectMode={true}
            setPdfFile={()=>{}} 
            handleShow={()=>{}}
            selected={selected}
            setSelected={setSelected}
          />
        </Modal.Body>
        <Modal.Footer>
          <Container fluid>
            <Row className=''>
                <Col className='col-9 d-flex justify-content-between align-items-center'>
                  {
                    changeCount > 0 && 
                    <span>{`${changeCount} ${t('general:messages.number-of-linked-policies')}`}</span>
                  }
                </Col>
              <Col className='col-3 pe-0 d-flex justify-content-end'>
                <Button className='btn btn-primary btn-md' onClick={applyNewPolicies}>
                    {t('menus:actions.apply')}
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PolicySelection;