import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import Guide from './guide/index';

const container = document.getElementById('root');

const root = ReactDOM.createRoot(container);
root.render(
  <Router>
    <Guide />
  </Router>
);
