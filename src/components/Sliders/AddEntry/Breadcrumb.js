import React, { useState, useEffect } from 'react'
import './AddEntry.scss'

import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFolderClosed, faFolderOpen } from '@fortawesome/pro-light-svg-icons'

export const AddEntry = ({
  location,
  ...props
}) => {

  const {tree, item, newPolicyName} = props
  const [policyName, setPolicyName] = useState(newPolicyName)

  useEffect(() => {
    setPolicyName(newPolicyName);
  });

  const findNode = (data, id) => {
    
  }
  
  let breadcrumb = []; 
  let breadcrumb2 = [];
  if(item && item._id) {
    const element = tree.items[item._id];
    breadcrumb.push(element);
    let element2, element3;
    if(element && element.parent) {
      element2 = findNode(tree, element.parent)
      breadcrumb = [element2].concat(breadcrumb);
    }
    if(element2 && element2.parent) {
      element3 = findNode(tree, element2.parent)
      breadcrumb = [element3].concat(breadcrumb);
    }
  }

  if(policyName) {
    breadcrumb2.push({data:{name: policyName, id: '999'}});
  }

  const targetIcon = props.folder ? faFolderClosed : faFilePdf;

  return (
    <>
      <Breadcrumb className='mt-2'>
        {breadcrumb.map(
          (item, index) => {
            const active = item && item.data.name === policyName;
            return(
              <Breadcrumb.Item href="#" active={active} key={item.data._id}>
                {index === 0 ? <FontAwesomeIcon className='text-primary me-2' icon={faFolderOpen} /> : <></>}
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

export default AddEntry
