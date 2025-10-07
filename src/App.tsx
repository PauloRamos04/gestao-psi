import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components (sempre carregados)
import { ProtectedRoute, PublicRoute } from './components/layout';

// Login - sempre carregado (primeira página)
import Login from './pages/Login';

// Lazy loading de todas as outras páginas
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FaturamentoPage = lazy(() => import('./pages/FaturamentoPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SublocationsPage = lazy(() => import('./pages/SublocationsPage'));
const InteractionsPage = lazy(() => import('./pages/InteractionsPage'));
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'));
const ProntuarioPage = lazy(() => import('./pages/ProntuarioPage'));
const LogsPage = lazy(() => import('./pages/LogsPage'));

// Lazy loading de componentes de features
const UsuariosList = lazy(() => import('./components/features/usuarios/UsuariosList'));
const PacientesList = lazy(() => import('./components/features/pacientes/PacientesList'));
const SessoesList = lazy(() => import('./components/features/sessoes/SessoesList'));
const PagamentosList = lazy(() => import('./components/features/pagamentos/PagamentosList'));
const ClinicasList = lazy(() => import('./components/features/clinicas/ClinicasList'));
const PsicologosList = lazy(() => import('./components/features/psicologos/PsicologosList'));
const SalasList = lazy(() => import('./components/features/salas/SalasList'));
const MensagensList = lazy(() => import('./components/features/mensagens/MensagensList'));
const IMCCalculator = lazy(() => import('./components/features/tools/IMCCalculator'));
const LifeTimeCalculator = lazy(() => import('./components/features/tools/LifeTimeCalculator'));
const SessionTimer = lazy(() => import('./components/features/tools/SessionTimer'));
const ColorChooser = lazy(() => import('./components/features/tools/ColorChooser'));
const PasswordChange = lazy(() => import('./components/features/tools/PasswordChange'));
const AgendaCalendar = lazy(() => import('./components/features/agenda/AgendaCalendar'));

// Componente de loading otimizado
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    background: 'var(--bg)'
  }}>
    <Spin size="large" tip="Carregando..." />
  </div>
);


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
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
            path="/psicologos" 
            element={
              <ProtectedRoute>
                <PsicologosList />
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

          {/* Agenda/Calendário */}
          <Route 
            path="/agenda" 
            element={
              <ProtectedRoute>
                <AgendaCalendar />
              </ProtectedRoute>
            } 
          />

          {/* Prontuários */}
          <Route 
            path="/prontuarios" 
            element={
              <ProtectedRoute>
                <ProntuarioPage />
              </ProtectedRoute>
            } 
          />

          {/* Logs do Sistema */}
          <Route 
            path="/logs" 
            element={
              <ProtectedRoute>
                <LogsPage />
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
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;