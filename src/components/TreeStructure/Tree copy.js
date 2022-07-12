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
import useSWR from 'swr'

const { TreeNode } = Tree;

const fetcher = url => axios.get(url).then(res => res.data)
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
  console.log('RENDER TREE')

  const { t } = useTranslation()
  const [treeData, setTreeData] = useState();
  const [selected, setSelected] = useState();
  const [nodeCreation, setNodeCreation] = useState(false);
  const { fetchedData, isLoading, isError } = useTreeData();

  //AddEntries
  const [show, setShow] = useState(false);
  const [folder, setFolder] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => {
    // useTreeData();
    setShow(false);
  }

  useEffect(() => {
    setTreeData(fetchedData);
  });

  const onDragEnter = info => {
    console.log(info);
  };

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
    setSelected(info.node.key)
  };

  const onLoad = (selectedKeys, info) => {
    console.log("load", selectedKeys, info);
  };

  const onDrop = info => {
    console.log('on drop', info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    setTreeData(data)
  };

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
      // if (item.children) {
      //     return (
      //         <TreeNode title={item.name} 
      //             size={item.folder ? item.children.length : undefined}
      //             key={item._id}
      //             dataRef={item}
      //             className={item.folder ? 'folder' : ''}
      //         >
      //             {renderTreeData(item.children, level + 1)}
      //         </TreeNode>
      //     );
      // }
      console.log('itemId', item._id)
      return {key: item._id, title: item.name, dataRef: item, children: []} 
      // <TreeNode
      //     {...item}
      //     title={item.name}
      //     key={item._id}
      //     dataRef={item}
      //     className={item.folder ? 'folder' : ''}
      // />;
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
        showline={{ hideLeafIcon: true }}
        // defaultExpandedKeys={["0-0-0"]}
        switcherIcon={<DownOutlined />}
        onSelect={onSelect}
        draggable
        blockNode
        // showLine
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
