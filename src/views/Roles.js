import React, { useState, useEffect } from 'react'
import { App } from '../App'
import { useParams } from "react-router-dom";

import { PageHeader } from '../components/PageHeader'
import { Tree } from '../components/TreeStructure'

import { RoleDetails } from '../components/Sliders/RoleDetails'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { useNavigate } from 'react-router-dom';
import { useSWRConfig }  from 'swr'

export const Roles = ({ ...props }) => {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig()
  const { roleId } = useParams();
  
  const handleShowRoleDetails = (role) => {
    navigate(`/roles/${role.data._id}`)
  }

  const handleClose = async () => {
    await mutate('https://localhost:3000/roles');
    navigate('/roles')
  }

  return (
    <App router={props.router}>

      <div className='wrapper2'>
        <Row className='w-100 me-2'>
          <Col className='tree-root'>
            <PageHeader />
            <Tree 
              apiRoute={'roles'}
              selected={roleId ? roleId : undefined}
              setSelected={() => {}}
              handleClose={handleClose}
              showDetails={handleShowRoleDetails}
            />
          </Col>
        </Row>
          {
            roleId ?
              <RoleDetails
                roleId={roleId}
                handleClose={handleClose}
              />
            : <></>
          }
      </div>

    </App>
  )
}

export default Roles
