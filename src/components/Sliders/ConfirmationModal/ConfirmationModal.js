import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container'
import { useTranslation } from 'react-i18next'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';

import './ConfirmationModal.scss'

export const ConfirmationModal = ({
  show,
  setConfirmationModal,
  confirmCallback,
  ...props
}) => {
  const { t } = useTranslation();

  const handleClose = () => {
    setConfirmationModal(false);
  }

  const onConfirm = () => {
    confirmCallback()
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} className='modal-bg confirmation-modal'>
        <Modal.Header closeButton>
         {t('general:actions.confirmation.title')}
        </Modal.Header>
        <Modal.Body className=''>
         {t('general:actions.confirmation.message')}
        </Modal.Body>
        <Modal.Footer className='py-0 px-0 '>
          <Container fluid>
            <Row className=''>
              <Col className='col-6 pe-0 d-flex justify-content-end'>
                <Button className='btn btn-primary btn-md d-block' onClick={onConfirm}>
                    Cancel
                </Button>
              </Col>
              <Col className='col-6 pe-0 d-flex justify-content-end'>
                <Button className='btn btn-danger btn-md d-block' onClick={onConfirm}>
                    {t('general:actions.confirmation.action')}
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmationModal;