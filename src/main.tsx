/**
 * Main client entry point for STREAMIA.
 *
 * This file bootstraps the React application and mounts the root component.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/login.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
