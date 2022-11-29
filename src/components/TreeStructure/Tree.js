import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react'
import './Tree.scss'

import { GenericNode } from './GenericNode'
import { useTranslation } from 'react-i18next'
import { TreeHeader } from './TreeHeader'
import { useAuth0 } from '@auth0/auth0-react';

import axios from 'axios'
import useSWR, { useSWRConfig }  from 'swr'

import { treeReducer, setCollapsed, getAncestryArray, generateNewSortOrder } from './tree-utils.js'

import Tree, {
  mutateTree,
  moveItemOnTree
} from '@atlaskit/tree';

const PADDING_PER_LEVEL = 32;
const config = (token) => ({
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

const fetcher = (url, token) => axios.get(url, config(token)).then(res => res.data);
const poster = (url, body, token) => axios.post(url, body, config(token)).then(res => res.data);

export const TreeStructure = ({
  router,
  setPdfFile,
  handleShow,
  selected,
  setSelected,
  ...props
}) => {

  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation()
  const [remoteTreeData, setRemoteTreeData] = useState();
  const [treeData, setTreeData] = useState();
  const [filter, setFilter] = useState('');

  const { mutate } = useSWRConfig()
  const [token, setToken] = useState();
  const tokenPromise = useMemo(async () => getAccessTokenSilently(), []);
  tokenPromise.then((token) => {
    setToken(token);
  })
  
  const { data, error } = useSWR(token ? ['https://localhost:3000/entries', token] : null, fetcher);

  useLayoutEffect(() => {
    setRemoteTreeData(data);
  }, [data]);

  const onExpand = (itemId) => {
    const result = mutateTree(treeReducer(treeData, remoteTreeData), itemId, { isExpanded: true });
    setRemoteTreeData(result)
    setTreeData(result)
  };
  
  const onCollapse = (itemId) => {
    const result = mutateTree(treeReducer(treeData, remoteTreeData), itemId, { isExpanded: false });
    setRemoteTreeData(result)
    setTreeData(result)
  };
  
  const collapseExpandAll = (action) => {
    const isExpanded = action === 'expand' ? true : false;
    const result = mutateTree(setCollapsed(treeData, remoteTreeData, isExpanded), '1', { isExpanded: isExpanded });
    setRemoteTreeData(result)
    setTreeData(result)
  }

  const onDragEnd = async ( source, destination ) => {
    if (!destination) { return; }
    
    const draggedEntryId = remoteTreeData.items[source.parentId].children[source.index];
    const newSortOrder = generateNewSortOrder(remoteTreeData, source, destination);
    const newTree = moveItemOnTree(treeReducer(treeData, remoteTreeData, undefined, true), source, destination); 
    //SEEMS GOOD WHEN NEW-SO IS LOWER THAN AFTER --- DISCREPANCY BETWEEN LIBRARY INDEXING AND BE RESORTING
    // Fixes sortOrder for dragged item
    newTree.items[draggedEntryId] = {...newTree.items[draggedEntryId], data:{ ...newTree.items[draggedEntryId].data, sortOrder: newSortOrder}}
    
    // Fixes children order in parent item
    newTree.items[destination.parentId] = {...newTree.items[destination.parentId], data:{ ...newTree.items[destination.parentId].data, children: newTree.items[destination.parentId].children}}
    // newTree.items[destination.parentId] = {...newTree.items[destination.parentId], children: newTree.items[destination.parentId].data.children}

    // setTreeData(newTree)
    // setRemoteTreeData(newTree)

    let changeParams = {_id: draggedEntryId, sortOrder: newSortOrder};
    if ( source.parentId !== destination.parentId ) changeParams.parent = destination.parentId;

    await mutate(['https://localhost:3000/entries', token], newTree, false)
    const getResult = async (entries) => {
      //A Post request to update one item shouldn't return the complete list no?
      //So what is the best practice for that update to return the list?
      await poster('https://localhost:3000/entries/sortorder', changeParams, token);
      return newTree;
    }
    const options = { rollbackOnError: true }
    try {
      mutate(['https://localhost:3000/entries', token], getResult, options)
    } catch (error) {
      console.log('error', error);
    }
  };

  const onSelect = (itemId) => {
    setSelected(itemId);
  };

  if (error) return "An error has occurred.";
  if ((!error && !data) || !remoteTreeData) return "Loading...";
  return (
    <>
      <TreeHeader
        filter={filter}
        setFilter={setFilter}
        collapseAll={() => collapseExpandAll('collapse')}
        expandAll={() => collapseExpandAll('expand')}
      />
      <Tree
        tree={treeReducer(treeData, remoteTreeData, filter)}
        renderItem={(renderItemParams) => (
          <GenericNode 
            renderItemParams={renderItemParams}
            offsetPerLevel={PADDING_PER_LEVEL}
            setPdfFile={setPdfFile}
            handleShow={(item, folder) => handleShow(item, getAncestryArray(item._id, remoteTreeData), folder)}
            selected={selected}
            onSelect={onSelect}
          />
        )}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onDragEnd={onDragEnd}
        offsetPerLevel={PADDING_PER_LEVEL}
        isDragEnabled
        // onDragStart={onDragStart}
        // isNestingEnabled={true}
      />
    </>
  );
}

export default TreeStructure
