import React, { useState, useEffect } from "react";
import UploadService from "../../service/file-upload.js";

import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const UploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };

  const upload = () => {
    let currentFile = selectedFiles[0];
    setProgress(0);
    setCurrentFile(currentFile);
    UploadService.upload(currentFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setMessage(response.data.message);
        return UploadService.getFiles();
      })
      .then((files) => {
        setFileInfos(files.data);
      })
      .catch(() => {
        setProgress(0);
        setMessage("Could not upload the file!");
        setCurrentFile(undefined);
      });
    setSelectedFiles(undefined);
  };

  return (
    <div>
      {currentFile && (
        <div className="progress">
          <div
            className="progress-bar progress-bar-info progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}

      <Form.Group as={Row} className='mb-3'>
        <Form.Label htmlFor='inputPassword5'>Fichier</Form.Label>
        <Form.Control
          type='file'
          id='file'
          aria-describedby='fileHelpBlock'
          filename={fileInfos}
          onChange={selectFile}
        />
        <Form.Text id='fileHelpBlock' muted>
          Your password must be 8-20 characters long, contain letters and numbers.
        </Form.Text>
      </Form.Group>
      
      <button
        className="btn btn-success"
        disabled={!selectedFiles}
        onClick={upload}
      >
        Upload
      </button>
      <div className="alert alert-light" role="alert">
        {message}
      </div>
    </div>
  );
};
export default UploadFiles;