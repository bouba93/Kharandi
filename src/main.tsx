import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import 'katex/dist/katex.min.css';



window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global Error:', { message, source, lineno, colno, error });
  // You could also send this to a logging service
};

window.addEventListener('unhandledrejection', function(event) {
  const reason = event.reason;
  
  // Prevent AI Studio overlay for known silent errors
  if (reason instanceof Error && reason.message === 'SILENT_ERROR') {
    event.preventDefault();
    return;
  }

  const reasonStr = String(reason);
  
  // Ignore common browser extension errors that don't affect the app
  const ignoredErrors = [
    'tabs:outgoing.message.ready',
    'Extension context invalidated',
    'ResizeObserver loop limit exceeded'
  ];
  
  if (ignoredErrors.some(err => reasonStr.includes(err))) {
    event.preventDefault();
    return;
  }

  // Custom parsing for Firestore JSON errors
  if (reason instanceof Error && reason.message.startsWith('{') && reason.message.endsWith('}')) {
    try {
      const parsed = JSON.parse(reason.message);
      console.error('Firestore Error Detailed:', parsed);
    } catch (e) {
      // Not JSON, ignore
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
