import React, { useLayoutEffect, useState } from 'react'
import './Tree.scss'

import { GenericNode } from './GenericNode'
import { useTranslation } from 'react-i18next'
import { TreeHeader } from './TreeHeader'

import axios from 'axios'
import useSWR, { useSWRConfig }  from 'swr'

import { treeReducer, setCollapsed, getAncestryArray } from './tree-utils.js'

import Tree, {
  mutateTree,
  moveItemOnTree
} from '@atlaskit/tree';

const PADDING_PER_LEVEL = 32;
const fetcher = url => axios.get(url).then(res => res.data)
const poster = (url, body) => axios.post(url, body).then(res => res.data)

const useTreeData = () => {
  const { data, error } = useSWR('http://localhost:3000/entries', fetcher)
  return {
    fetchedData: data,
    isLoading: !error && !data,
    isError: error
  }
};

export const TreeStructure = ({
  router,
  setPdfFile,
  handleShow,
  selected,
  setSelected,
  ...props
}) => {
  
  const { t } = useTranslation()
  const [remoteTreeData, setRemoteTreeData] = useState();
  const [treeData, setTreeData] = useState();
  const { fetchedData, isLoading, isError } = useTreeData();
  const [filter, setFilter] = useState('')
  
  //AddEntries
  const { mutate } = useSWRConfig()

  useLayoutEffect(() => {
    setRemoteTreeData(fetchedData);
  }, [fetchedData]);

  
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

  // const onDragStart = ( source, destination ) => {
  // };

  const onDragEnd = async ( source, destination ) => {
    if (!destination) { return; }
    
    const draggedEntryId = remoteTreeData.items[source.parentId].children[source.index];
    const newSortOrder = generateNewSortOrder(source, destination);
    const newTree = moveItemOnTree(treeReducer(treeData, remoteTreeData), source, destination);
    newTree.items[draggedEntryId] = {...newTree.items[draggedEntryId], data:{ ...newTree.items[draggedEntryId].data, sortOrder: newSortOrder}}
    setTreeData(newTree)

    let changeParams = {_id: draggedEntryId, sortOrder: newSortOrder};
    if ( source.parentId !== destination.parentId ) changeParams.parent = destination.parentId;

    await mutate('http://localhost:3000/entries', newTree, false)
    const getResult = async () => {
      //A Post request to update one item shouldn't return the complete list no?
      //So what is the best practice for that update to return the list?
      await poster('http://localhost:3000/entries/sortorder', changeParams);
      return newTree;
    }
    const options = { optimisticData: newTree, rollbackOnError: true }
    try {
      mutate('http://localhost:3000/entries', getResult, options)
    } catch (error) {
      console.log('error', error)
    }
  };

  const getChildFromParent = (parentId, index) => {
    return remoteTreeData.items[remoteTreeData.items[parentId].children[index]];
  }

  const generateNewSortOrder = (source, destination) => {

    const getMiddleSortOrder = (pos1, pos2) => {
      if(pos1.sortOrder && pos2.sortOrder) {
        return Math.ceil((pos1.sortOrder + pos2.sortOrder)/2);
      }
      return -1;
    }

    if(destination.index > 0 && destination.index < remoteTreeData.items[destination.parentId].children.length - 1) {
      if(source.index < destination.index) {
        return getMiddleSortOrder(
            getChildFromParent(destination.parentId, destination.index).data,
            getChildFromParent(destination.parentId, destination.index+1).data
          );
        } else {
          return getMiddleSortOrder(
            getChildFromParent(destination.parentId, destination.index-1).data,
            getChildFromParent(destination.parentId, destination.index).data
          );
        }
    }
    if(destination.index === 0) {
      const ogFirstChild = getChildFromParent(destination.parentId, 0).data;
      if(ogFirstChild.sortOrder === 0) {
        return -100;
      } else if(ogFirstChild.sortOrder > 0) {
        return getMiddleSortOrder(0, ogFirstChild.sortOrder);
      }
    }
    if(destination.index === remoteTreeData.items[destination.parentId].children.length - 1) {
      const parentEntry = remoteTreeData.items[destination.parentId];
      return getChildFromParent(destination.parentId, parentEntry.children.length - 1).data.sortOrder + 100
    }
  }

  const onSelect = (itemId) => {
    setSelected(itemId)
  };

  if (isError) return "An error has occurred.";
  if (isLoading || !remoteTreeData) return "Loading...";
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
