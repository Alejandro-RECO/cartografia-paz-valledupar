import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/kalam/400.css'
import '@fontsource/kalam/700.css'
import '@fontsource-variable/atkinson-hyperlegible-next'
import '@fontsource-variable/atkinson-hyperlegible-next/wght-italic.css'
import './styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
