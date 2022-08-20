import React, { useEffect, useLayoutEffect, useState } from 'react'
import './Tree.scss'

import { AddEntry } from '../Sliders/AddEntry'
import { PDFViewer } from '../Sliders/PDFViewer'
import { GenericNode } from './GenericNode'
import { Slider } from '../Sliders/Slider/Slider.js'
import { useTranslation } from 'react-i18next'
import { TreeHeader } from './TreeHeader'

import axios from 'axios'
import useSWR, { useSWRConfig }  from 'swr'

import { treeReducer, setCollapsed } from './tree-utils.js'

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
  ...props
}) => {
  
  const { t } = useTranslation()
  const [remoteTreeData, setRemoteTreeData] = useState();
  const [treeData, setTreeData] = useState();
  const [selected, setSelected] = useState();
  const { fetchedData, isLoading, isError } = useTreeData();
  const [filter, setFilter] = useState('')
  
  //AddEntries
  const { mutate } = useSWRConfig()
  const [showSlider, setShowSlider] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [folder, setFolder] = useState(false);

  //PdfViewer
  const [pdfFile, setPdfFile] = useState();
  
  const handleShow = (item, folder = false) => {
    setShowSlider(item);
    if (folder) setFolder(true)
  }
  
  const handleClose = async () => {
    await mutate('http://localhost:3000/entries')
    setShowSlider(false);
  }
  
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

    // await mutate('http://localhost:3000/entries', newTree, false)
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
    console.log('ItemId', itemId)
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
      <Slider 
        placement='end'
        title={folder ? t('menus:headings.add-folder') : t('menus:headings.add-policy')}
        show={showSlider}
        handleClose={handleClose}
      >
        <AddEntry
          item={showSlider}
          tree={remoteTreeData}
          folder={folder}
          setFolder={setFolder}
          handleClose={handleClose}
        />
      </Slider>
      <PDFViewer
        show={!!pdfFile}
        setPdfFile={setPdfFile}
        pdfFile={pdfFile}
      ></PDFViewer>
      <Tree
        tree={treeReducer(treeData, remoteTreeData, filter)}
        renderItem={(renderItemParams) => (
          <GenericNode 
            renderItemParams={renderItemParams}
            offsetPerLevel={PADDING_PER_LEVEL}
            setPdfFile={setPdfFile}
            handleShow={handleShow}
            selected={selected}
            onSelect={onSelect}
          />
        )}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onDragEnd={onDragEnd}
        // onDragStart={onDragStart}
        offsetPerLevel={PADDING_PER_LEVEL}
        // isNestingEnabled={true}
        isDragEnabled
      />
    </>
  );
  
}

export default TreeStructure
