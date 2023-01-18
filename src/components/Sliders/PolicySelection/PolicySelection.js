// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// import Row from 'react-bootstrap/Row'
import { Tree } from '../../../components/TreeStructure'
import { LinkedRolesList } from '../RoleDetails'

// import { faArrowUp, faArrowDown, faSeal } from '@fortawesome/pro-light-svg-icons'

import './PolicySelection.scss'

export const PolicySelection = ({
  show,
  ...props
}) => {
  const [selected, setSelected] = useState([]);
  const [itemsSelected, setItemsSelected] = useState([]);
  const handleClose = () => {}

  return (
    <>

      <Modal show={show} onHide={handleClose} className='modal-bg policy-selection-modal'>
        <Modal.Body className=''>
          <Tree 
            apiRoute={'entries'}
            treeSelectionMode={true}
            setPdfFile={()=>{}} 
            handleShow={()=>{}}
            selected={selected}
            setSelected={setSelected}
            setItemsSelected={setItemsSelected}
          />
        </Modal.Body>
        {/* <Modal.Footer>
          {selected.length > 0 ? 
            <LinkedRolesList linkedPolicies={selected.map((selectedItem) => {
              return selectedItem.data;
            })}/> :
            <></>
          }
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default PolicySelection;