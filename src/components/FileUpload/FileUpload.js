import React , {useState} from 'react';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import { ICON_STATE, ThreeStateIcon } from '../ThreeStateIcon/ThreeStateIcon';
import { faCheck, faSpinner, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'

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

export const FileUpload = ({
  formData,
  setFormData,
  ...props
}) => {

  const [loading, setLoading] = useState(ICON_STATE.INITIAL);

  const handleFileInput = async (e) => {
    e.preventDefault();
    if (!e.target.files.length) {
      return alert('Choose a file to upload first.');
    } else {
      addFile(e.target.files[0])
    }
  }
  
  const addFile = async (file) => {
    try {
      // 'Key' can create folder with URI (e.g. folder/file.jpg) 
      const uploadParams = {
        Bucket: albumBucketName,
        Key: file.name, 
        Body: file
      };
      setLoading(ICON_STATE.LOADING);
      try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log('Successfully uploaded photo :', data);
        if(data.$metadata.httpStatusCode === 200) {
          setFormData({...formData, file: file.name})
          setLoading(ICON_STATE.FINAL);
        }
      } catch (err) {
        return alert('There was an error uploading your photo: ', err.message);
      }
    } catch (err) {
      console.log('err', err)
    }
  };  

  return (<Form.Group as={Row} className='mb-3'>
          <Col className='px-0'>
            <Form.Label htmlFor='inputPassword5'>Fichier</Form.Label>
            <div className='lh-group'>
              <InputGroup className="mb-3 lh-input-group">
                <Form.Control
                  type='file'
                  id='file'
                  aria-describedby='fileHelpBlock'
                  onChange={handleFileInput}
                />
                <InputGroup.Text id="basic-addon2">
                  <ThreeStateIcon icons={{ initial: faCloudArrowUp, loading: faSpinner, final: faCheck }} iconState={loading} />
                </InputGroup.Text>
              </InputGroup>
            </div>
          </Col>
         </Form.Group>)
}

export default FileUpload;