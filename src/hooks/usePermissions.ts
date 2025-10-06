import { useAuth } from '../contexts/AuthContext';
import { hasMenuPermission, hasActionPermission } from '../constants/permissions';

/**
 * Hook para verificar permissões do usuário atual
 */
export const usePermissions = () => {
  const { user } = useAuth();

  const canAccessMenu = (menuKey: string): boolean => {
    if (!user?.tipoUser) return false;
    return hasMenuPermission(user.tipoUser, menuKey);
  };

  const canDoAction = (module: string, action: string): boolean => {
    if (!user?.tipoUser) return false;
    return hasActionPermission(user.tipoUser, module, action);
  };

  const isAdmin = (): boolean => {
    return user?.tipoUser === 'ADMIN' || user?.tipoUser === '1';
  };

  const isPsicologo = (): boolean => {
    return user?.tipoUser === 'PSICOLOGO' || user?.tipoUser === '2';
  };

  const isFuncionario = (): boolean => {
    return user?.tipoUser === 'FUNCIONARIO' || user?.tipoUser === '3';
  };

  return {
    canAccessMenu,
    canDoAction,
    isAdmin,
    isPsicologo,
    isFuncionario,
    userType: user?.tipoUser || ''
  };
};

