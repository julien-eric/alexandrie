import React, { useEffect, useLayoutEffect, useState } from 'react'
import './Tree.scss'

import { DownOutlined } from '@ant-design/icons';
import { AddEntry } from '../Sliders/AddEntry'
import { PDFViewer } from '../Sliders/PDFViewer'
import { TreeNode } from './TreeNode'
import { Slider } from '../Sliders/Slider/Slider.js'
import { useTranslation } from 'react-i18next'



import axios from 'axios'
import useSWR, { useSWRConfig }  from 'swr'

import Tree, {
  mutateTree,
  moveItemOnTree,
  RenderItemParams,
  TreeItem,
  TreeData,
  ItemId,
  TreeSourcePosition,
  TreeDestinationPosition,
} from '@atlaskit/tree';

const fetcher = url => axios.get(url).then(res => res.data)
const poster = (url, body) => axios.post(url, body).then(res => res.data)


const PADDING_PER_LEVEL = 32;

const useTreeData = () => {
  const { data, error } = useSWR('http://localhost:3000/entries', fetcher)
  return {
    fetchedData: data,
    isLoading: !error && !data,
    isError: error
  }
};

const mergeLocalRemote = (local, remote) => {
  if(!remote) return

  const items = {};
  for (const itemId in remote.items) {
    items[itemId] = {...remote.items[itemId], isExpanded: local && local.items[itemId] ? local.items[itemId].isExpanded : false}
  }
  
  return {
    rootId: '1',
    items: items
  };
}

export const TreeStructure = ({
  router,
  ...props
}) => {
  
  const { t } = useTranslation()
  const [remoteTreeData, setRemoteTreeData] = useState();
  const [treeData, setTreeData] = useState();
  const [selected, setSelected] = useState();
  const [nodeCreation, setNodeCreation] = useState(false);
  const { fetchedData, isLoading, isError } = useTreeData();
  
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
    const result = mutateTree(mergeLocalRemote(treeData, remoteTreeData), itemId, { isExpanded: true });
    // const item = result.items[itemId]

    setRemoteTreeData(result)
    setTreeData(result)
  };
  
  const onCollapse = (itemId) => {
    const result = mutateTree(mergeLocalRemote(treeData, remoteTreeData), itemId, { isExpanded: false });
    setRemoteTreeData(result)
    setTreeData(result)
  };
  
  // const onDragStart = ( source, destination ) => {
  // };

  const onDragEnd = async ( source, destination ) => {
    if (!destination) { return; }
    
    const draggedEntryId = remoteTreeData.items[source.parentId].children[source.index];
    const newSortOrder = generateNewSortOrder(source, destination);
    const newTree = moveItemOnTree(mergeLocalRemote(treeData, remoteTreeData), source, destination);
    newTree.items[draggedEntryId] = {...newTree.items[draggedEntryId], data:{ ...newTree.items[draggedEntryId].data, sortOrder: newSortOrder}}
    setTreeData(newTree)

    // await mutate('http://localhost:3000/entries', newTree, false)
    const getResult = async () => {
      //This doesn't seem right. But a POST request to update one item shouldn't return the complete list no?... 
      //So what is the best practice for that update to return the list?   
      await poster('http://localhost:3000/entries/sortorder', {_id: draggedEntryId, sortOrder: newSortOrder});
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

  if (isError) return "An error has occurred.";
  if (isLoading || !remoteTreeData) return "Loading...";
  return (
    <>
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
        tree={mergeLocalRemote(treeData, remoteTreeData)}
        renderItem={(renderItemParams) => <TreeNode renderItemParams={renderItemParams} offsetPerLevel={PADDING_PER_LEVEL} setPdfFile={setPdfFile} handleShow={handleShow}/>}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onDragEnd={onDragEnd}
        // onDragStart={onDragStart}
        offsetPerLevel={PADDING_PER_LEVEL}
        isDragEnabled
      />
    </>
  );
  
}

export default TreeStructure
