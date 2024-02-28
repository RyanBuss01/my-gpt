/*********************************************** 
  This is the entry point of the application.
  It is responsible for rendering the App component into the root element.

  written by: Ryan Bussert
*******************************************************/
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

