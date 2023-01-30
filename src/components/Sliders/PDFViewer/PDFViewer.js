import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Row from 'react-bootstrap/Row'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import { faArrowUp, faArrowDown, faSeal, faBadge } from '@fortawesome/pro-light-svg-icons'
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons'

import axios from 'axios'
import useSWR, { useSWRConfig }  from 'swr'
import { buildTokenInfo } from '../../../utils.js'

import './PDFViewer.scss'

const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const PDFViewer = ({
  show,
  setFileSelection,
  fileSelection,
  ...props
}) => {
  const DIR = {
    TOP: 'top',
    BOTTOM: 'bottom'
  }
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { mutate } = useSWRConfig();

  const handleClose = () => {
    setPageNumber(1);
    setNumPages(null);
    setFileSelection({});
  }
  
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }  

  const scrollToPage = (direction) => {
    const pages = document.querySelectorAll('.react-pdf__Page');
    const topPosition = document.querySelector('.modal').scrollTop;

    if(direction === DIR.BOTTOM) {
      for(let pageIterator = 0; pageIterator < pages.length; pageIterator++) {
        const pageElement = pages[pageIterator];
        if(pageElement.offsetTop > topPosition) {
          pageElement.scrollIntoView({ behavior: 'smooth' });
          break;
        }
      }
    }

    if(direction === DIR.TOP) {
      for(let pageIterator = pages.length - 1; pageIterator >= 0 ; pageIterator--) {
        const pageElement = pages[pageIterator];
        if (pageElement.offsetTop + 20 <= topPosition) {
          pageElement.scrollIntoView({ behavior: 'smooth' });
          break;
        }
      }   
    }
  }

  const hasRead = async (read) => {
    await poster(`https://localhost:3000/entries/${fileSelection.entryId}/reads/${read}`, {}, localStorage.getItem('accessToken'));
    await mutate([`https://localhost:3000/entries`, localStorage.getItem('accessToken')], false)
  };

  return (
    <>

      <Modal show={show} onHide={handleClose} dialogClassName='pdf-modal' className='modal-bg'>
        <Modal.Body className='pdf-height'>
          <Document file={ {data: fileSelection.pdfFile}} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
          <div className='reader-helper'>
            <Row className='mb-1'>
              <Button className='p-3 btn btn-canvas-gray btn-sm' onClick={() => scrollToPage(DIR.TOP)}>
                <FontAwesomeIcon className='fa-fw' icon={faArrowUp}/>
              </Button>
            </Row>
            <Row className='mb-1'>
              <Button className='p-3 btn btn-canvas-gray btn-sm' onClick={() => scrollToPage(DIR.BOTTOM)}>
                <FontAwesomeIcon className='fa-fw' icon={faArrowDown} />
              </Button>
            </Row>
            <Row>
              <Button className='p-3 btn btn-canvas-gray btn-sm' onClick={() => hasRead(true)}>
                <FontAwesomeIcon icon={fileSelection.read ? faBadgeCheck : faBadge} />
              </Button>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PDFViewer;