import React, { useEffect, useLayoutEffect, useState } from 'react'
import './Tree.scss'

import { GenericNode } from './GenericNode'
import { useTranslation } from 'react-i18next'
import { TreeHeader } from './TreeHeader'
import { buildTokenInfo } from '../../utils.js'

import axios from 'axios'
import useSWR, { useSWRConfig }  from 'swr'

import { treeReducer, getLineage, setCollapsed, getAncestryArray, generateNewSortOrder } from './tree-utils.js'

import Tree, {
  mutateTree,
  moveItemOnTree
} from '@atlaskit/tree';

const PADDING_PER_LEVEL = 32;

const fetcher = (url, token) => axios.get(url, buildTokenInfo(token)).then(res => res.data);
const poster = (url, body, token) => axios.post(url, body, buildTokenInfo(token)).then(res => res.data);

export const TreeStructure = ({
  router,

  apiRoute,
  nodeSelectionMode,
  setPdfFile,
  handleShow,
  selected,
  setSelected,
  changeSelection,
  ...props
}) => {

  const { t } = useTranslation()
  const [remoteTreeData, setRemoteTreeData] = useState();
  const [treeData, setTreeData] = useState();
  const [filter, setFilter] = useState('');
  const [fetchPersonalPolicies, setFetchPersonalPolicies] = useState(nodeSelectionMode ? false : true);
  const { mutate } = useSWRConfig()
  const token = localStorage.getItem('accessToken');
  

  const fetchEntriesUrl = `https://localhost:3000/${apiRoute}${fetchPersonalPolicies ? '?user=true' : ''}`
  const { data, error } = useSWR(token !== undefined ? [fetchEntriesUrl, token] : null, fetcher);
  
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

    await mutate([`https://localhost:3000/${apiRoute}`, token], newTree, false)
    const getResult = async (results) => {
      //A Post request to update one item shouldn't return the complete list no?
      //So what is the best practice for that update to return the list?
      await poster(`https://localhost:3000/${apiRoute}/sortorder`, changeParams, token);
      // await fetcher('https://localhost:3000/robot-sort', token);
      return newTree;
    }
    const options = { rollbackOnError: true }
    try {
      mutate([`https://localhost:3000/${apiRoute}`, token], getResult, options)
    } catch (error) {
      console.log('error', error);
    }
  };

  const onSelect = (item) => {
    
    const union = (array1, array2) => {
      return Array.from(new Set(array1.concat(array2)));
    }

    const hasChildren = item.data.folder && item.data.children && item.data.children.length > 0;
    let newSelection = [...selected];

    if(hasChildren) {

      const selfIndex = selected.indexOf(item.data._id);
      const selfSelected = selfIndex !== -1;
      
      const lineage = getLineage(item.data._id, treeData)
      const allChildrenSelected = newSelection.length >0 && lineage.every((selectedItemId) => {
        return newSelection.includes(selectedItemId);
      });
      const someChildrenSelected = !allChildrenSelected && lineage.some((selectedItemId) => {
        return newSelection.includes(selectedItemId);
      });

      if(allChildrenSelected) {
        if(selfSelected) {
          newSelection = newSelection.filter((selectedItemId) => {
            return !lineage.includes(selectedItemId);
          });
        } else {
          newSelection = [...newSelection, item.data._id]
        }
      }
      
      if(someChildrenSelected) {
        newSelection = union(newSelection, lineage);
      }

      if(!someChildrenSelected) {
        if(selfSelected) {
          newSelection = newSelection.filter(selectedItemId =>
            selectedItemId !== item.data._id
          );
        } else {
          newSelection = [...lineage]
        }
      }

    } else {
      
      const itemIndex = newSelection.indexOf(item.data._id);
      
      if(itemIndex === -1) {
        newSelection = [...newSelection, item.data._id]
      } else {
        newSelection = newSelection.filter(selectedItemId =>
          selectedItemId !== item.data._id
        );
      }
    }

    setSelected(newSelection);
    
  };

  if (error) return "An error has occurred.";
  if ((!error && !data) || !remoteTreeData) return "Loading...";
  return (
    <>
      <TreeHeader
        apiRoute={apiRoute}
        filter={filter}
        setFilter={setFilter}
        collapseAll={() => collapseExpandAll('collapse')}
        expandAll={() => collapseExpandAll('expand')}
        nodeSelectionMode={nodeSelectionMode}
        fetchPersonalPolicies={fetchPersonalPolicies}
        setFetchPersonalPolicies={setFetchPersonalPolicies}
      />
      <Tree
        tree={treeReducer(treeData, remoteTreeData, filter)}
        renderItem={(renderItemParams) => (
          <GenericNode
            apiRoute={apiRoute}
            nodeSelectionMode={nodeSelectionMode}
            renderItemParams={renderItemParams}
            offsetPerLevel={PADDING_PER_LEVEL}
            setPdfFile={setPdfFile}
            handleShow={(item, folder) => handleShow(item, getAncestryArray(item._id, remoteTreeData), folder)}
            selected={selected}
            setSelected={setSelected}
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
