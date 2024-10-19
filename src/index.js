// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Import 3rd party modules from npm
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom'; // Removed 'Redirect' and 'withRouter'

// Import stylesheets
import '../src/assets/css/inspectWA.css';

// Import routes
import About from './components/pages/about';
import Membership from './components/pages/membership';
import Ethics from './components/pages/ethics';
import Inspectors from './components/pages/inspectors';
import Contact from './components/pages/contact';
import Members from './components/pages/members';
import Media from './components/pages/media';

// Define routing
const routing = (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<About />} />
      <Route path="/membership" element={<Membership />} />
      <Route path="/ethics" element={<Ethics />} />
      <Route path="/inspectors" element={<Inspectors />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/media" element={<Media />} />
      <Route path="/members" element={<Members />} />
      <Route path="/index.html" element={<App />} />
      {/* 
        If you need to handle redirects or not found routes, use the Navigate component
        Example:
        <Route path="*" element={<Navigate to="/" replace />} />
      */}
    </Routes>
  </Router>
);

// This renders the 'root' component
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
