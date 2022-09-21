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
      <Modal show={show} onHide={handleClose} dialogClassName='pdf-modal' className='modal-bg'>
        <Modal.Body className='pdf-height'>
          <Document file={ {data: pdfFile}} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          { numPages !== null && 
            <>
              <Button size='sm' variant="secondary" onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </Button>
              <Button size='sm' variant="secondary" onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === numPages}>
                <FontAwesomeIcon icon={faArrowRight} />
              </Button>
            </>
          }
          <Button size='sm' variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button> */}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PDFViewer;