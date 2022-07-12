import React, { useEffect, useState } from 'react'
import './Tree.scss'

import 'antd/dist/antd.css';
// import 'antd/dist/antd.dark.css';

import { Tree } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { AddEntry } from '../Sliders/AddEntry'
import { TreeTitle } from './TreeTitle.js'
import { Slider } from '../Sliders/Slider/Slider.js'
import { useTranslation } from 'react-i18next'

import axios from 'axios'
import useSWR, { useSWRConfig }  from 'swr'

const { TreeNode } = Tree;

const fetcher = url => axios.get(url).then(res => res.data)
const poster = (url, body) => axios.post(url, body).then(res => res.data)
const putter = (url, body) => axios.post(url, body).then(res => res.data)

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
  const [treeData, setTreeData] = useState();
  const [selected, setSelected] = useState();
  const [nodeCreation, setNodeCreation] = useState(false);
  const { fetchedData, isLoading, isError } = useTreeData();

  //AddEntries
  const { mutate } = useSWRConfig()
  const [show, setShow] = useState(false);
  const [folder, setFolder] = useState(false);
  const handleShow = () => setShow(true);
  
  const handleClose = async () => {
    await mutate('http://localhost:3000/entries')
    setShow(false);
  }

  useEffect(() => {
    setTreeData(fetchedData);
  });

  const onDragEnter = info => {
    // console.log('enter', info.node);
  };

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
    setSelected(info.node.key)
  };

  const onLoad = (selectedKeys, info) => {
    console.log("load", selectedKeys, info);
  };

  const onDrop = async info => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // console.log('dropKey', dropKey);
    // console.log('dragKey', info.dragNode);
    // console.log('dropPos', dropPos);
    // console.log('dropPosition', dropPosition);

    const findBySequence = (data, sequence, getNextPos) => {
      let dataLevel = data;
      let element = {};
      let nextElement;
  
      sequence.forEach((position, index, array) => {
        position = Number(position);
        const lastPos = getNextPos && index === array.length - 1 && position + 1 <= dataLevel.length - 1;
        if(!dataLevel[position]) {
          return -1;
        }
        element = dataLevel[position];
        if(lastPos) {
          nextElement = dataLevel[position + 1];
        }
        dataLevel = element.children;
      });
      return { dropElement: element, nextElement: nextElement }
    }

    dropPos.shift();
    const { dropElement, nextElement } = findBySequence(treeData, dropPos, true);    
    const result = await putter('http://localhost:3000/entries/sortorder', {_id: dragKey, sortOrder: getMiddleSortOrder(dropElement, nextElement)});
    console.log('result', result)
    await mutate('http://localhost:3000/entries')
  };

  const getMiddleSortOrder = (pos1, pos2) => {
    if(pos1.sortOrder && pos2.sortOrder) {
      return Math.ceil((pos1.sortOrder + pos2.sortOrder)/2);
    }
    return -1;
  }

  const showAddEntry = (item, folder) => {
    setShow(item);
    setFolder(folder);
  }

  const renderTreeData = (data, level = 0) => {
    if(!data) return [];
    return data.map((item) => {
      item.level = level;
      item.showAddEntry = (folder) => {
        showAddEntry(item, folder)
      };
      if (item.children) {
          const children = renderTreeData(item.children, level + 1)
          return {key: item._id, title: item.name, className: item.folder ? 'folder' : '', dataRef: item, children: children} 
      }
      return {key: item._id, title: item.name, className: item.folder ? 'folder' : '', dataRef: item, children: []} 
    });
  }
  const renderedTreeData = renderTreeData(treeData);

  if (isError) return "An error has occurred.";
  if (isLoading) return "Loading...";
  return (
    <>
      <Slider 
        placement='end'
        title={folder ? t('menus:headings.add-folder') : t('menus:headings.add-policy')}
        show={show}
        handleClose={handleClose}
      >
        <AddEntry
          item={show}
          tree={treeData}
          folder={folder}
          setFolder={setFolder}
          handleClose={handleClose}
        />
      </Slider>

      {/* <p className='fs-6 text-primary mb-3'>Seules les PPs qui vous sont associées sont affichées</p> */}

      <Tree
        // showLine
        // defaultExpandedKeys={["0-0-0"]}
        showline={{ hideLeafIcon: true }}
        switcherIcon={<DownOutlined />}
        onSelect={onSelect}
        draggable
        blockNode
        className='lh-tree hide-file-icon'
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        onLoad={onLoad}
        treeData={renderedTreeData}
        titleRender={(data) => {
          return <TreeTitle 
            data={data}
            fetchedData={fetchedData}
            selected={selected}
            nodeCreation={nodeCreation}
            setNodeCreation={setNodeCreation}
          />
        }}
      />
    </>
  );
}

export default TreeStructure
