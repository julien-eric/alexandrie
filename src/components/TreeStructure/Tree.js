import React, { useEffect, useLayoutEffect, useState } from 'react'
import './Tree.scss'

import { PDFViewer } from '../../components/Sliders/PDFViewer'

import { GenericNode } from './GenericNode'
import { useTranslation } from 'react-i18next'
import { TreeHeader } from './TreeHeader'
import { buildTokenInfo } from '../../utils.js'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import axios from 'axios'
import useSWR, { useSWRConfig }  from 'swr'
import { ICON_STATE } from './ReadFilter.js'

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
  selectMode,
  noLeafNodes,
  foldersOnly,
  selected,
  setSelected,
  showDetails,
  ...props
}) => {

  const { t } = useTranslation()
  const [remoteTreeData, setRemoteTreeData] = useState();
  const [fileSelection, setFileSelection] = useState({});
  const [treeData, setTreeData] = useState();
  const [filter, setFilter] = useState('');
  const [readFilter, setReadFilter] = useState(ICON_STATE.ALL);
  const [fetchPersonalPolicies, setFetchPersonalPolicies] = useState(selectMode ? false : true);
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

  const clearFilters = () => {
    setFilter('');
    setReadFilter(ICON_STATE.ALL);
  }
  
  const onDragEnd = async ( source, destination ) => {
    if (!destination) { return; }
    
    const draggedEntryId = remoteTreeData.items[source.parentId].children[source.index];
    const newSortOrder = generateNewSortOrder(remoteTreeData, source, destination);
    const newTree = moveItemOnTree(treeReducer(treeData, remoteTreeData, undefined, undefined, true), source, destination); 
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
  const reducedTree = treeReducer(treeData, remoteTreeData, filter, readFilter);

  return (
    <>
      <PDFViewer
        show={!!fileSelection.pdfFile}
        setFileSelection={setFileSelection}
        fileSelection={fileSelection}
      />
      <TreeHeader
        apiRoute={apiRoute}
        filter={filter}
        setFilter={setFilter}
        collapseAll={() => collapseExpandAll('collapse')}
        expandAll={() => collapseExpandAll('expand')}
        selectMode={selectMode}
        setSelected={setSelected}
        showEntryDetails={showDetails}
        fetchPersonalPolicies={fetchPersonalPolicies}
        setFetchPersonalPolicies={setFetchPersonalPolicies}
        readFilter={readFilter}
        setReadFilter={setReadFilter}
      />
      <Row className='mb-3'>
        <Col className='col-12'>
          <small className='text-deep-gray2 fw-normal'>{t('general:messages.number-of-displayed-policies', {number:Object.keys(reducedTree.items).length-1, total:Object.keys(data.items).length-1})}</small>
          { Object.keys(reducedTree.items).length !== Object.keys(data.items).length ? <small><a className='ms-2 text-deep-gray2 fw-normal' href='#' onClick={clearFilters}>{t('general:messages.clear-filters')}</a></small> : <></>}
        </Col>
      </Row>
      <Tree
        tree={reducedTree}
        renderItem={(renderItemParams) => (
          <GenericNode
            apiRoute={apiRoute}
            selectMode={selectMode}
            renderItemParams={renderItemParams}
            offsetPerLevel={PADDING_PER_LEVEL}
            setFileSelection={setFileSelection}
            showEntryDetails={showDetails}
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
