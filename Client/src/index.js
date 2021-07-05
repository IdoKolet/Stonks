/*
  File: index.js
  Handles app startup.
  Exposses the encapsulated component: componnents/App.js
*/

// Imports
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Rendering the App component into "root" DOM node
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

