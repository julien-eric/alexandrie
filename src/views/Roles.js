import React, { useState, useRef } from 'react'
import { App } from '../App'
import { useParams, useNavigate } from "react-router-dom";

import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'

import { EditRole } from '../components/Sliders/RoleDetails/EditRole'
import { ConfirmationModal } from '../components/Sliders/ConfirmationModal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { useSWRConfig }  from 'swr'
import { buildTokenInfo } from '../../src/utils.js'

import axios from 'axios'
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const Roles = ({ ...props }) => {
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const { mutate } = useSWRConfig()
  const { roleId } = useParams();
  const newRoleId = useRef('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleShowRoleDetails = (role) => {
    navigate(`/roles/${role.data._id}`)
  }

  const handleClose = async () => {
    await mutate('https://localhost:3000/roles');
    navigate('/roles')
  }

  const onCreate = async () => {
    const result = await poster(`https://localhost:3000/roles`, {}, token);
    if(result && result._id) {
      navigate(`/roles/${result._id}`)
      newRoleId.current = result._id
    }
  }

  const cancelCreation = async () => {
    const result = await poster(`https://localhost:3000/roles/delete/${roleId}`, {}, token);
    if(result) {
      if(result.status === 404) {
        alert('There was an error deleting the role')
      } else if(result._id) {
        // await mutate([treeUrl, token], false)
        await setConfirmDelete(false)
        newRoleId.current = ''
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
            <PageHeader />
            <Tree 
              apiRoute={'roles'}
              onCreate={onCreate}
              selected={roleId ? roleId : undefined}
              setSelected={() => {}}
              handleClose={handleClose}
              showDetails={handleShowRoleDetails}
            />
          </Col>
        </Row>
          {
            roleId ?
              <EditRole
                roleId={roleId}
                handleClose={handleClose}
                creatingNewRole={newRoleId}
                setConfirmDelete={setConfirmDelete}
              />
            : <></>
          }
      </div>

    </App>
  )
}

export default Roles
