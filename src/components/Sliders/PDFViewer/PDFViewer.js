import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';

export const PDFViewer = ({
  show,
  setPdfFile,
  pdfFile,
  ...props
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleClose = () => setPdfFile();
  
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }  
  

  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName='pdf-modal'>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Document file={ {data: pdfFile}} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PDFViewer;