import React, { useState, useEffect } from 'react'
import { buildTokenInfo } from '../../../utils.js'
import useSWR, { useSWRConfig }  from 'swr'

import { EntryDetails } from './EntryDetails'

import axios from 'axios'
const fetcher = (url, token) => axios.get(url, buildTokenInfo(token)).then(res => res.data);
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const EditEntry = ({
  entryId,
  newParentId,
  handleClose,
  creatingNewEntry,
  treeSelectionMode,
  setTreeSelectionMode,
  ...props
}) => {
  const [entry, setEntry] = useState();
  const [parent, setParent] = useState();
  const token = localStorage.getItem('accessToken');

  const useEntry = () => {
    const { data, error } = useSWR(token !== undefined ? [`https://localhost:3000/entries/${entryId}`, token] : null, fetcher);
    return { entryData: data, entryError: error }
  }

  const useParentEntry = () => {
    const { data, error } = useSWR(
      entry ? () => {
        if(token !== undefined)
          return [`https://localhost:3000/entries/${newParentId ? newParentId : entry.data.parent}`, token]
      } : null, 
      fetcher
    );
    return { parentEntryData: data, parentEntryError: error }
  }

  // Read on the original way I was trying to solve this problem but didn't manage to find at the time 
  // https://stackoverflow.com/questions/63487265/use-swr-with-depending-request-data
  const { entryData, entryError } = useEntry()
  const { parentEntryData, parentEntryError } = useParentEntry()
  
  useEffect(() => {
    if(entryData) {
      setEntry({id:entryData._id, data:entryData})
    }
  }, [entryData, entryId]);
  
  useEffect(() => {
    if(parentEntryData) {
      setParent({id:parentEntryData._id, data:parentEntryData})
    }
  }, [parentEntryData]);

  const handleSubmit = async (formData) => {
    let entryInfo = {...formData};
    const result = await poster(`https://localhost:3000/entries/${entryInfo._id}`, entryInfo, localStorage.getItem('accessToken'));
    if(result._id) {handleClose()}
  };

  return (
    <>
      { entry &&
        <EntryDetails
          entry={entry}
          parent={parent}
          setParent={setParent}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          treeSelectionMode={treeSelectionMode}
          setTreeSelectionMode={setTreeSelectionMode}
        />
      }
    </>
  )
}

export default EditEntry
