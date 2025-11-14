// src/main.tsx

import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import App from './app'

// Styles
import './styles/index.css'

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
