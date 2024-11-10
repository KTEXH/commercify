import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure you are importing the correct module
import App from './App';
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />); // Your main App component
} else {
    console.error('Root element not found');
}
