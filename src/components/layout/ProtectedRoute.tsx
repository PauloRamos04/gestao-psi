/**
 * Componente de Rota Protegida
 * Protege rotas que precisam de autenticação
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from './Layout';
import LoadingSpinner from '../common/LoadingSpinner';
import { Result, Button } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen tip="Carregando..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se a role é necessária
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Layout>
        <Result
          status="403"
          title="403"
          subTitle="Desculpe, você não tem permissão para acessar esta página."
          extra={
            <Button type="primary" onClick={() => window.history.back()}>
              Voltar
            </Button>
          }
        />
      </Layout>
    );
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;

