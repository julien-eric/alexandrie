import React, { useState, useEffect } from 'react'
import './AddEntry.scss'

import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFolderClosed, faFolderOpen } from '@fortawesome/free-solid-svg-icons'

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
    function iter(a) {
        if (a._id === id) {
            result = a;
            return true;
        }
        return Array.isArray(a.children) && a.children.some(iter);
    }
    var result;
    data.some(iter);
    return result;
  }
  
  let breadcrumb = []; 
  let breadcrumb2 = [];
  if(item && item._id) {
    const element = findNode(tree, item._id);
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
    breadcrumb2.push({name: policyName});
  }

  const targetIcon = props.folder ? faFolderClosed : faFilePdf;

  return (
    <>
      <Breadcrumb className='mt-2'>
        {breadcrumb.map(
          (item, index) => {
            const active = item.name === policyName;
            return(
              <Breadcrumb.Item href="#" active={active}>
                {index === 0 ? <FontAwesomeIcon className='text-primary me-2' icon={faFolderOpen} /> : <></>}
                {item.name}
              </Breadcrumb.Item>
            )
          }
        )} 
      </Breadcrumb>
      <Breadcrumb>
        {breadcrumb2.map(
          (item) => {
            const active = item.name === policyName;
            return(<Breadcrumb.Item href="#" active={active}><FontAwesomeIcon className='text-primary me-2' icon={targetIcon} />{item.name}</Breadcrumb.Item>)
          }
        )} 
      </Breadcrumb>
    </>)
}

export default AddEntry
