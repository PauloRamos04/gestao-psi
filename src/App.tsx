import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UsuariosList from './components/UsuariosList';
import SessoesList from './components/SessoesList';
import PacientesList from './components/PacientesList';
import PagamentosList from './components/PagamentosList';
import FaturamentoPage from './components/FaturamentoPage';
import MensagensList from './components/MensagensList';
import ClinicasList from './components/ClinicasList';
import SalasList from './components/SalasList';

// Novas páginas implementadas
import IMCCalculator from './components/IMCCalculator';
import LifeTimeCalculator from './components/LifeTimeCalculator';
import SessionTimer from './components/SessionTimer';
import ColorChooser from './components/ColorChooser';
import PasswordChange from './components/PasswordChange';
import ReportsPage from './components/ReportsPage';
import HistoryPage from './components/HistoryPage';
import SublocationsPage from './components/SublocationsPage';
import InteractionsPage from './components/InteractionsPage';
import DownloadsPage from './components/DownloadsPage';

// Componente para proteger rotas que precisam de autenticação
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Componente para rotas públicas (como login)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública - Login */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />

          {/* Rotas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/usuarios" 
            element={
              <ProtectedRoute>
                <UsuariosList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/pacientes" 
            element={
              <ProtectedRoute>
                <PacientesList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/sessoes" 
            element={
              <ProtectedRoute>
                <SessoesList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/pagamentos" 
            element={
              <ProtectedRoute>
                <PagamentosList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/faturamento" 
            element={
              <ProtectedRoute>
                <FaturamentoPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/mensagens" 
            element={
              <ProtectedRoute>
                <MensagensList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/clinicas" 
            element={
              <ProtectedRoute>
                <ClinicasList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/salas" 
            element={
              <ProtectedRoute>
                <SalasList />
              </ProtectedRoute>
            } 
          />

          {/* Funcionalidades Especiais */}
          <Route 
            path="/imc" 
            element={
              <ProtectedRoute>
                <IMCCalculator />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/tempo-vida" 
            element={
              <ProtectedRoute>
                <LifeTimeCalculator />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/temporizador" 
            element={
              <ProtectedRoute>
                <SessionTimer />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/cores" 
            element={
              <ProtectedRoute>
                <ColorChooser />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/trocar-senha" 
            element={
              <ProtectedRoute>
                <PasswordChange />
              </ProtectedRoute>
            } 
          />

          {/* Relatórios e Históricos */}
          <Route 
            path="/relatorios" 
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/historicos" 
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } 
          />

          {/* Sublocações e Interações */}
          <Route 
            path="/sublocacoes" 
            element={
              <ProtectedRoute>
                <SublocationsPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/interacoes" 
            element={
              <ProtectedRoute>
                <InteractionsPage />
              </ProtectedRoute>
            } 
          />

          {/* Downloads */}
          <Route 
            path="/downloads" 
            element={
              <ProtectedRoute>
                <DownloadsPage />
              </ProtectedRoute>
            } 
          />

          {/* Rota padrão */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Rota 404 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900">404</h1>
                  <p className="text-gray-600 mt-2">Página não encontrada</p>
                </div>
              </div>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;