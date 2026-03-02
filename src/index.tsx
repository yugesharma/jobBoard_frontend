import './globals.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from 'react-oidc-context'

const cognitoAuthConfig = {
     authority:
          'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_hh9ybuZoy',
     client_id: '2r86kj5psq1s1asm89u2md7dh9',
     redirect_uri: 'https://d84l1y8p4kdic.cloudfront.net',
     response_type: 'code',
     scope: 'email openid phone',
}

const root = ReactDOM.createRoot(
     document.getElementById('root') as HTMLElement
)
root.render(
     <React.StrictMode>
          <AuthProvider {...cognitoAuthConfig}>{<App />}</AuthProvider>
     </React.StrictMode>
)
