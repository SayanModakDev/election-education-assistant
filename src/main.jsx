import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Dynamically inject the runtime environment config
const envScript = document.createElement('script');
envScript.src = '/env-config.js';
envScript.onerror = () => envScript.remove();
document.head.appendChild(envScript);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
