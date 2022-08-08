import React, { useState } from 'react'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { useTranslation } from 'react-i18next'
import { CSSTransition} from 'react-transition-group'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleRight, faFilePdf, faFolder, faFolderClosed, faHyphen } from '@fortawesome/free-solid-svg-icons'


///////////////////////
// Set AWS Info
const REGION ='us-east-1';
const S3_BUCKET ='lighthouse-pilot';
const ID_POOL_ID = 'us-east-1:ef383138-3a73-47e1-93df-6217b2b1612e';
// Initialize the Amazon Cognito credentials provider
const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: ID_POOL_ID,
  }),
});
const albumBucketName = S3_BUCKET;
///////////////////////

const getS3Link = async (fileKey) => {
  console.log('fileKey', fileKey)
  const getParams = {
    Bucket: albumBucketName,
    Key: fileKey
  };
  const command = new GetObjectCommand(getParams);
  const response = await s3.send(command);
  alert(JSON.stringify(response))
}

export const TreeNode = ({
  router,
  data,
  selected,
  nodeCreation,
  setNodeCreation,
  renderItemParams,
  offsetPerLevel,
  handleShow,
  ...props
}) => {
  const { t } = useTranslation();
  const { item, onExpand, onCollapse, provided, snapshot } = renderItemParams;
  const [inProp, setInProp] = useState(true);

  const folderCategory = (level) => {
    if(level == 0) return 'Service';
    if(level == 1) return 'Département';
    if(level == 2) return 'Unité';
    if(level === undefined) return undefined
  } 
  const levelCategory = folderCategory(provided.draggableProps.style.paddingLeft / offsetPerLevel);

  const getIcon = (
    item,
    onExpand,
    onCollapse
  ) => {
    if (item.data.folder && item.children && item.children.length > 0) {
      return item.isExpanded ? (
        <Button variant="link" size="sm" onClick={() => onCollapse(item.id)} className='round d-inline text-black' bg="deep-gray">
          <FontAwesomeIcon icon={faAngleDown} />
        </Button>
        ) : (
        <Button variant="link" size="sm" onClick={() => onExpand(item.id)} className='round d-inline text-black' bg="deep-gray">
          <FontAwesomeIcon icon={faAngleRight} />
        </Button>
      );
    } else if (item.data.folder) {
      return (<span className='round d-inline text-black' bg="deep-gray">
        -
        </span>
      )
    }
    return (<Button variant="link" size="sm" onClick={() => onExpand(item.id)} className='round d-inline' bg="deep-gray">
      <FontAwesomeIcon icon={faFilePdf} onClick={(e) => {getS3Link(item.data.files[0])}} />
    </Button>);

  };

  let classes = 'tree-node'
  if(item.data.folder) classes += ' folder';
  else classes += ' leaf';
  if(snapshot.isDragging) classes += ' dragging'

  return (
    <CSSTransition in={inProp} timeout={200} classNames="my-node">

      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
      <div className={classes}>
        <span>{getIcon(item, onExpand, onCollapse)}</span>
        {item.data.folder ?
          <DropdownButton
            variant="link"
            title={item.data.folder ? <FontAwesomeIcon className='text-primary' icon={faFolderClosed} /> : <FontAwesomeIcon icon={faFilePdf} />}
            size="sm"
            className='folder-button caret-off me-2'
            style={{display: 'inline'}}
            id="input-group-dropdown-1"
          >
            <Dropdown.Item href="#" onClick={() => handleShow(item.data)}>{t('general:actions.create-policy.short')}</Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => handleShow(item.data, true)}>{t('general:actions.create-level.short')}</Dropdown.Item>
          </DropdownButton>
          : <></>
        }
        <span>
          
          {item.data.folder ?
            <Badge bg="primary me-2">
              {levelCategory}
            </Badge> :
            <></>
          }
        </span>  
        <span>{item.data ? item.data.name : ''}</span>
          {/* {item.data.sortOrder !== undefined ?
            <Badge className='size-badge round' bg="deep-gray ms-2">{item.data.sortOrder}</Badge> :
            <></>
          } */}
          {item.children.length !== 0 ?
            <Badge className='size-badge round' bg="deep-gray ms-2">{item.children.length}</Badge> :
            <></>
          }
      </div>
    </div>
  </CSSTransition>
  );
}

export default TreeNode
