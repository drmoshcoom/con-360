
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider, useAppContext } from './contexts/AppContext';
import Layout from './components/Layout';
import Store from './pages/Store';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user } = useAppContext();
    if (!user?.isAdmin) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const AppRoutes: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Store />} />
                <Route path="/product/:id" element={<Store />} />
                <Route path="/cart" element={<Store />} />
                <Route path="/checkout" element={<Store />} />
                
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />
                <Route path="/account" element={<Auth />} />
                
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    } 
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    );
};

const App: React.FC = () => {
  return (
    <AppContextProvider>
        <HashRouter>
            <AppRoutes />
        </HashRouter>
    </AppContextProvider>
  );
};

export default App;
