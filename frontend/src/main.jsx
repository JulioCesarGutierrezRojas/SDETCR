import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router/router.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render( 
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <AppRouter />
      </SocketProvider>
    </AuthProvider>   
  </StrictMode>,
)
