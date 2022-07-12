import React from 'react';
import ReactDOM from 'react-dom';
import './i18n'
import './index.css';
import MyPps from './views/MyPps'
import JobTypes from './views/JobTypes'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom' // react-router v4/v5
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Router>
    <Routes>
      <Route exact path='/' element={<MyPps/>} />
      <Route exact path='/jobs' element={<JobTypes/>} />
    </Routes>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
