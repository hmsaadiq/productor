import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ConfiguratorPage from './pages/ConfiguratorPage';
import ConfirmationPage from './pages/ConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/LoginModal';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <ConfigProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header onSignInClick={() => setIsLoginModalOpen(true)} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/customize" element={<ConfiguratorPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App; 