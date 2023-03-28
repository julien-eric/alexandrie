import React, { useState, useEffect } from 'react'
import { buildTokenInfo } from '../../../utils.js'
import useSWR, { useSWRConfig }  from 'swr'

import { RoleDetails } from './RoleDetails'

import axios from 'axios'
const fetcher = (url, token) => axios.get(url, buildTokenInfo(token)).then(res => res.data);
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const EditRole = ({
  location,
  handleClose,
  roleId,
  creatingNewRole,
  ...props
}) => {
  const [role, setRole] = useState();
  const token = localStorage.getItem('accessToken');

  const useRole = () => {
    const { data, error } = useSWR(token !== undefined ? [`https://localhost:3000/roles/${roleId}`, token] : null, fetcher);
    return { roleData: data, roleError: error }
  }

  const useSubbedEntries = () => {
    const { data, error } = useSWR(
      () => {
        if(role && roleId !== role.id)
          return null
        if(token !== undefined)
          return [`https://localhost:3000/entries?role=${roleId}`, token]
      }, 
      fetcher
    );
    return { subbedEntries: data, subbedEntriesError: error }
  }

  // Read on the original way I was trying to solve this problem but didn't manage to find at the time 
  // https://stackoverflow.com/questions/63487265/use-swr-with-depending-request-data
  const { roleData, roleError } = useRole()
  const { subbedEntries, subbedEntriesError } = useSubbedEntries()
  
  useEffect(() => {
    if(roleData) {
      setRole({id:roleData._id, data:roleData})
    }
  }, [roleData, roleId]);

  const reduceItems = (items, onlyIds) => {
    if(!items || items.length === 0)
      return []
    if(items['1']) delete items['1'];
    const roleAffectedPolicies = [];
    for (const [id, entry] of Object.entries(items)) {
      roleAffectedPolicies.push(onlyIds ? entry.id : entry.data)
    }
    return roleAffectedPolicies;
  }

  const handleSubmit = async (formData) => {
    let roleInfo = {
      name: formData ? formData.name : role ? role.name : ''
    };
    const result = await poster(`https://localhost:3000/roles/${role.id}`, { ...roleInfo }, localStorage.getItem('accessToken'));
    if(result._id) {handleClose()}
  };

  return (
    <>
      { role &&
        <RoleDetails
          role={role}
          handleClose={handleClose}
          rolePolicies={subbedEntries && reduceItems(subbedEntries.items, true)}
          handleSubmit={handleSubmit}
        />
      }
    </>
  )
}

export default EditRole
