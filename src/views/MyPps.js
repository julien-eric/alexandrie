import React, { useState, useEffect, useRef } from 'react'
import { App } from '../App'
import { useParams, useNavigate } from "react-router-dom";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { EditEntry } from '../components/Sliders/EntryDetails'
import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'
import { ConfirmationModal } from '../components/Sliders/ConfirmationModal'

import { useSWRConfig }  from 'swr'
import { buildTokenInfo } from '../../src/utils.js'

import axios from 'axios'
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const MyPps = ({ ...props }) => {
  const token = localStorage.getItem('accessToken');
  const [selected, setSelected] = useState();
  const [treeSelectionMode, setTreeSelectionMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const newEntryId = useRef('');
  const newParentId = useRef('');

  const navigate = useNavigate();
  const { mutate } = useSWRConfig()
  
  const { entryId } = useParams();

  useEffect(() => {
    document.title = 'Alexandrie';
  }, []);

  const handleShowRoleDetails = (entry) => {
    navigate(`/entries/${entry.data._id}`)
  }

  const handleClose = async () => {
    mutate([`https://localhost:3000/entries`, localStorage.getItem('accessToken')], false)
    mutate([`https://localhost:3000/entries?user=true`, localStorage.getItem('accessToken')], false)
    mutate([`https://localhost:3000/entries?user=true&foldersOnly=false`, localStorage.getItem('accessToken')], false)
    if(newEntryId.current) {
      setConfirmDelete(true)
    } else {
      await mutate('https://localhost:3000/entries');
      navigate('/')
    }
  }

  const onSelect = async (entryId) => {
    if(treeSelectionMode) {
      newParentId.current = entryId
    }
    setSelected(entryId)
  }

  const onCreate = async () => {
    const result = await poster(`https://localhost:3000/roles`, {}, token);
    if(result && result._id) {
      navigate(`/entries/${result._id}`)
      newEntryId.current = result._id
    }
  }

  const cancelCreation = async () => {
    const result = await poster(`https://localhost:3000/roles/delete/${entryId}`, {}, token);
    if(result) {
      if(result.status === 404) {
        alert('There was an error deleting the role')
      } else if(result._id) {
        // await mutate([treeUrl, token], false)
        await setConfirmDelete(false)
        newEntryId.current = ''
        handleClose()
      }
    }
  }

  return (
    <App router={props.router}>
      <ConfirmationModal 
        show={confirmDelete}
        setConfirmationModal={setConfirmDelete}
        confirmCallback={cancelCreation}
      />
      <div className='wrapper2'>
        <Row className='w-100 me-2'>
          <Col className='tree-root'>
            <PageHeader tempTitle={treeSelectionMode}/>
            <Tree 
              apiRoute={'entries'}
              selected={selected}
              setSelected={onSelect}
              showDetails={handleShowRoleDetails}
              singleSelect={treeSelectionMode}
              selectMode={treeSelectionMode}
              foldersOnly={treeSelectionMode}
            />
          </Col>
        </Row>

        {
          entryId ?
            <EditEntry
              entryId={entryId}
              treeSelectionMode={treeSelectionMode}
              setTreeSelectionMode={setTreeSelectionMode}
              newParentId={newParentId.current}
              handleClose={handleClose}
            /> : <></>
        }
      </div>

    </App>
  )
}

export default MyPps
