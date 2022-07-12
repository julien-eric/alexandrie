import React, { useEffect, useState } from 'react'
import './Tree.scss'

import 'antd/dist/antd.css';

import { Tree } from "antd";

const { TreeNode } = Tree;

export const TreeStructure = ({
  router,
  ...props
}) => {

  return (
    <TreeNode 
      title={title} 
      key={item._id}
      dataRef={item}
      className={item.folder ? 'folder' : ''}
    />
  );
}

export default TreeStructure
