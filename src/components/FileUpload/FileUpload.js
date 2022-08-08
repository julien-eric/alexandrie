import React , {useState} from 'react';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand, DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

export const UploadImageToS3WithReactS3 = ({
  formData,
  setFormData,
  ...props
}) => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState();

  const handleFileInput = async (e) => {
    e.preventDefault();
    if (!e.target.files.length) {
      return alert('Choose a file to upload first.');
    } else {
      await setSelectedFile(e.target.files[0]);
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
      setLoading('loading');
      try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log('Successfully uploaded photo :', data);
        if(data.$metadata.httpStatusCode === 200) {
          setFormData({...formData, file: file.name})
          setLoading('complete');
          // await getS3Link(file)
        }
      } catch (err) {
        return alert('There was an error uploading your photo: ', err.message);
      }
    } catch (err) {
      console.log('err', err)
    }
  };  

  const getIcon = () => {
    if(loading === undefined) return faCloudArrowUp;
    if(loading === 'loading') return faSpinner;
    if(loading === 'complete') return faCheck;
  }

  return (<Form.Group as={Row} className='mb-3'>
          <Col className='px-0'>
            <Form.Label htmlFor='inputPassword5'>Fichier</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type='file'
                id='file'
                aria-describedby='fileHelpBlock'
                onChange={handleFileInput}
              />
              
              <InputGroup.Text id="basic-addon2">
                <FontAwesomeIcon className={loading === 'loading' ? 'spinning' : ''} icon={getIcon()} />
              </InputGroup.Text>
            </InputGroup>
          </Col>
         </Form.Group>)
}

export default UploadImageToS3WithReactS3;