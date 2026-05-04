import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1A1A26',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'Cabinet Grotesk, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#BFFF00', secondary: '#0A0A0F' },
            },
            error: {
              iconTheme: { primary: '#FF6B6B', secondary: '#0A0A0F' },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
