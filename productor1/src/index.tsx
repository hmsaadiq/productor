// FRONTEND ENTRY POINT: This file is the main entry for the React frontend application.
// It renders the root React component (App) into the DOM.
//
// Design Patterns: Uses the React Component pattern and StrictMode for highlighting potential problems.
// Data Structures: Uses the React component tree (object-based), and the DOM (Document Object Model).
// Security: No direct security features here, but React's rendering helps prevent XSS by escaping values by default.

// Import the React library, which is required for using JSX and creating components.
import React from 'react';
// Import the ReactDOM client, which is used to render React components into the DOM.
import ReactDOM from 'react-dom/client';
// Import the global CSS file for styling the application.
import './index.css';
// Import the root App component, which contains the main application logic and routing.
import App from './App';


// Create a root for React rendering using the new React 18+ API.
// This attaches React to the HTML element with id 'root' in public/index.html.
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement // Type assertion for TypeScript.
);
// Render the App component inside React.StrictMode for highlighting potential problems in development.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);