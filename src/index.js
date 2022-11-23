import React from 'react';
import ReactDOM from 'react-dom';
import './i18n'
import './index.css';
import MyPps from './views/MyPps'
import JobTypes from './views/JobTypes'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom' // react-router v4/v5
import reportWebVitals from './reportWebVitals';
import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";

const PrivateRoute = () => <div>Private</div>;
export default withAuthenticationRequired(PrivateRoute, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});

ReactDOM.render(
  <Auth0Provider
    domain="dev-alexandrie.us.auth0.com"
    clientId="uyCPpwmrOqRUiATboaOVVxDqN79KS0c6"
    redirectUri={window.location.origin}
    audience="https://dev-alexandrie.us.auth0.com/api/v2/"
    scope="read:policies write:policies"
  >
    <Router>
      <Routes>
        <Route exact path='/' element={<MyPps/>} />
        <Route exact path='/jobs' element={<JobTypes/>} />
      </Routes>
    </Router>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
