/**
 * Sistema de Permissões por Tipo de Usuário
 * Define o que cada tipo de usuário pode acessar
 */

export const PERMISSIONS = {
  ADMIN: {
    // Administrador tem acesso total
    menus: [
      'dashboard',
      'usuarios',
      'pacientes',
      'sessoes',
      'pagamentos',
      'faturamento',
      'mensagens',
      'clinicas',
      'psicologos',
      'salas',
      'prontuarios',
      'relatorios',
      'historicos',
      'logs',
      'sublocacoes',
      'interacoes',
      'downloads',
      'imc',
      'tempo-vida',
      'temporizador',
      'cores',
      'trocar-senha'
    ],
    actions: {
      usuarios: { criar: true, editar: true, deletar: true, ativar: true, desativar: true },
      clinicas: { criar: true, editar: true, deletar: true, ativar: true, desativar: true },
      psicologos: { criar: true, editar: true, deletar: true },
      pacientes: { criar: true, editar: true, deletar: true, ativar: true },
      sessoes: { criar: true, editar: true, deletar: true, cancelar: true },
      pagamentos: { criar: true, editar: true, deletar: true },
      salas: { criar: true, editar: true, deletar: true },
      mensagens: { criar: true, editar: true, deletar: true },
      prontuarios: { criar: true, editar: true, visualizar: true, deletar: true },
      relatorios: { gerar: true, exportar: true },
      faturamento: { visualizar: true, exportar: true }
    }
  },

  PSICOLOGO: {
    // Psicólogo tem acesso às funcionalidades clínicas
    menus: [
      'dashboard',
      'pacientes',
      'sessoes',
      'pagamentos',
      'faturamento',
      'mensagens',
      'salas',
      'prontuarios',
      'relatorios',
      'historicos',
      'downloads',
      'imc',
      'tempo-vida',
      'temporizador',
      'cores',
      'trocar-senha'
    ],
    actions: {
      pacientes: { criar: true, editar: true, deletar: false, ativar: true },
      sessoes: { criar: true, editar: true, deletar: false, cancelar: true },
      pagamentos: { criar: true, editar: true, deletar: false },
      salas: { criar: false, editar: false, deletar: false },
      mensagens: { criar: false, editar: false, deletar: false },
      prontuarios: { criar: true, editar: true, visualizar: true, deletar: false },
      relatorios: { gerar: true, exportar: true },
      faturamento: { visualizar: true, exportar: true }
    }
  },

  FUNCIONARIO: {
    // Funcionário/Secretária tem acesso administrativo limitado
    menus: [
      'dashboard',
      'pacientes',
      'sessoes',
      'pagamentos',
      'mensagens',
      'salas',
      'imc',
      'tempo-vida',
      'trocar-senha'
    ],
    actions: {
      pacientes: { criar: true, editar: true, deletar: false, ativar: false },
      sessoes: { criar: true, editar: true, deletar: false, cancelar: true },
      pagamentos: { criar: true, editar: false, deletar: false },
      salas: { criar: false, editar: false, deletar: false },
      mensagens: { criar: false, editar: false, deletar: false },
      prontuarios: { criar: false, editar: false, visualizar: true, deletar: false },
      relatorios: { gerar: false, exportar: false },
      faturamento: { visualizar: false, exportar: false }
    }
  }
};

/**
 * Verificar se o usuário tem permissão para acessar uma rota
 */
export const hasMenuPermission = (userType: string, menuKey: string): boolean => {
  
  // userType pode vir como número (ID) ou string (nome)
  let tipoNormalizado = userType;
  
  // Converter ID para nome
  if (userType === '1') tipoNormalizado = 'ADMIN';
  else if (userType === '2') tipoNormalizado = 'PSICOLOGO';
  else if (userType === '3') tipoNormalizado = 'FUNCIONARIO';
  
  const permissions = PERMISSIONS[tipoNormalizado as keyof typeof PERMISSIONS];
  
  if (!permissions) {
    console.warn('Permissões não encontradas para tipo:', tipoNormalizado);
    return false;
  }
  
  return permissions.menus.includes(menuKey);
};

/**
 * Verificar se o usuário tem permissão para uma ação específica
 */
export const hasActionPermission = (
  userType: string, 
  module: string, 
  action: string
): boolean => {
  // Normalizar tipo de usuário
  let tipoNormalizado = userType;
  if (userType === '1') tipoNormalizado = 'ADMIN';
  else if (userType === '2') tipoNormalizado = 'PSICOLOGO';
  else if (userType === '3') tipoNormalizado = 'FUNCIONARIO';
  
  const permissions = PERMISSIONS[tipoNormalizado as keyof typeof PERMISSIONS];
  if (!permissions) return false;
  
  const moduleActions = permissions.actions[module as keyof typeof permissions.actions];
  if (!moduleActions) return false;
  
  return moduleActions[action as keyof typeof moduleActions] === true;
};

/**
 * Obter label amigável do tipo de usuário
 */
export const getUserTypeLabel = (tipo: string): string => {
  switch (tipo.toUpperCase()) {
    case 'ADMIN':
      return 'Administrador';
    case 'PSICOLOGO':
      return 'Psicólogo';
    case 'FUNCIONARIO':
      return 'Funcionário';
    default:
      return tipo;
  }
};

