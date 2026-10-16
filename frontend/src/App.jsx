import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PumpProvider } from './context/PumpContext';
import AppRoutes from './routes/AppRoutes'; 

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PumpProvider>
          <AppRoutes />
        </PumpProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;