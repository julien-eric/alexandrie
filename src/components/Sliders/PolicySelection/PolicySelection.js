// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container'
import { useTranslation } from 'react-i18next'
// import { faArrowUp, faArrowDown, faSeal } from '@fortawesome/pro-light-svg-icons'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';

import { Tree } from '../../../components/TreeStructure'
import { LinkedRolesList } from '../RoleDetails'

import './PolicySelection.scss'

export const PolicySelection = ({
  show,
  role,
  setShowPolicySelection,
  ...props
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState([]);
  const handleClose = () => {
    setShowPolicySelection(false);
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} className='modal-bg policy-selection-modal'>
        <Modal.Header closeButton>
         {t('general:headings.linking-policy-modal-header') + ' ' + role.name }
        </Modal.Header>
        <Modal.Body className=''>
          <Tree 
            apiRoute={'entries'}
            nodeSelectionMode={true}
            setPdfFile={()=>{}} 
            handleShow={()=>{}}
            selected={selected}
            setSelected={setSelected}
          />
        </Modal.Body>
        <Modal.Footer>
          <Container fluid>
            <Row className=''>
              <Col className='col-6 d-flex justify-content-between align-items-center'>
                <span>{`${selected.length} ${t('general:messages.number-of-linked-policies')}`}</span>
              </Col>
              <Col className='col-6 pe-0 d-flex justify-content-end'>
                <Button className='btn btn-primary btn-md' onClick={() => {}}>
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