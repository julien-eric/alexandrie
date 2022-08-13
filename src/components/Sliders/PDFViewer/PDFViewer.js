import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import { faArrowLeft, faArrowRight } from '@fortawesome/pro-light-svg-icons'

export const PDFViewer = ({
  show,
  setPdfFile,
  pdfFile,
  ...props
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleClose = () => {
    setPageNumber(1);
    setNumPages(null);
    setPdfFile();
  }
  
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }  
  

  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName='pdf-modal'>
        {/* <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <Document file={ {data: pdfFile}} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </Modal.Body>
        <Modal.Footer>
          { numPages !== null && 
            <>
              <Button variant="secondary" onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </Button>
              <Button variant="secondary" onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === numPages}>
                <FontAwesomeIcon icon={faArrowRight} />
              </Button>
            </>
          }
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