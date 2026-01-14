import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-3wzs4m6mi236anvn.us.auth0.com"
      clientId="mS1VQWOXL4pOTm1oDPch8txA3BPbhvyk"
      authorizationParams={{
        redirect_uri: window.location.origin + '/dashboard',
        audience: 'https://api.escon.com',
        scope: 'openid profile email'
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
