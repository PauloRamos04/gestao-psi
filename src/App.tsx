import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import { ProtectedRoute, PublicRoute } from './components/layout';

// Pages
import {
  Login,
  Dashboard,
  FaturamentoPage,
  ReportsPage,
  HistoryPage,
  SublocationsPage,
  InteractionsPage,
  DownloadsPage,
  ProntuarioPage,
} from './pages';

// Feature Components
import {
  UsuariosList,
  PacientesList,
  SessoesList,
  PagamentosList,
  ClinicasList,
  PsicologosList,
  SalasList,
  MensagensList,
  IMCCalculator,
  LifeTimeCalculator,
  SessionTimer,
  ColorChooser,
  PasswordChange,
} from './components/features';

// Import do calendário
import AgendaCalendar from './components/features/agenda/AgendaCalendar';


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