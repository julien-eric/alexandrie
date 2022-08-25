import React, { useState, useEffect } from 'react'
import './AddEntry.scss'

import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderClosed, faFolderOpen, faFolderPlus } from '@fortawesome/pro-light-svg-icons'
import { faFilePdf } from '@fortawesome/pro-thin-svg-icons'

export const TreeBreadcrumb = ({
  location,
  tree,
  item,
  ancestry,
  newPolicyName,
  ...props
}) => {
  const [policyName, setPolicyName] = useState(newPolicyName)

  useEffect(() => {
    setPolicyName(newPolicyName);
  });
   
  let breadcrumb2 = [];

  if(policyName) {
    breadcrumb2.push({data:{name: policyName, id: '999'}});
  }

  const targetIcon = props.folder ? faFolderPlus : faFilePdf;

  return (
    <>
      <Breadcrumb className='mt-2 text-break'>
        {ancestry.map(
          (item, index) => {
            const active = item && item.data.name === policyName;
            return(
              <Breadcrumb.Item href="#" active={active} key={item.data._id}>
                {index === 0 ? <FontAwesomeIcon className='text-primary text-break me-2' icon={faFolderOpen} /> : <></>}
                {item.data.name}
              </Breadcrumb.Item>
            )
          }
        )} 
      </Breadcrumb>
      <Breadcrumb>
        {breadcrumb2.map(
          (item) => {
            const active = item && item.data.name === policyName;
            return(<Breadcrumb.Item href="#" active={active}><FontAwesomeIcon className='text-primary me-2' icon={targetIcon} />{item.data.name}</Breadcrumb.Item>)
          }
        )} 
      </Breadcrumb>
    </>)
}

export default TreeBreadcrumb
