import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { patchDomForGoogleTranslate } from './lib/googleTranslateFix'

// must run before react renders so the guarded dom methods are in place
patchDomForGoogleTranslate()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


