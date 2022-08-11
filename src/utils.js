// Set AWS Info
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import {Buffer} from 'buffer';

const REGION ='us-east-1';
const S3_BUCKET ='lighthouse-pilot';
const ID_POOL_ID = 'us-east-1:ef383138-3a73-47e1-93df-6217b2b1612e';
const albumBucketName = S3_BUCKET;

// Initialize the Amazon Cognito credentials provider
const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: ID_POOL_ID,
  }),
});

const streamToData = async (stream) => {
  const reader = stream.getReader();
  const chunks = [];
  let stop = false;
  while (!stop) {
    const { done, value } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    if (done) {
      stop = true;
    }
  }
  return Buffer.concat(chunks);
};

const getS3Link = async (fileKey) => {
  const getParams = {
    Bucket: albumBucketName,
    Key: fileKey
  };
  const command = new GetObjectCommand(getParams);
  const { Body } = await s3.send(command);
  const result = await streamToData(Body) 
  console.log('getS3Link', result)
  return result;
}

export {
  getS3Link
}