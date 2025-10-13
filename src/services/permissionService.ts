/**
 * Serviço de Permissões
 * Implementa funcionalidades reais de gerenciamento de permissões
 */

import { APP_CONFIG } from '../config/app-config';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'patients' | 'sessions' | 'payments' | 'reports' | 'users';
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'import';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermission {
  userId: string;
  username: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
}

export interface PermissionAudit {
  id: string;
  userId: string;
  username: string;
  action: 'grant' | 'revoke' | 'role_assigned' | 'role_removed';
  permission?: string;
  role?: string;
  timestamp: string;
  performedBy: string;
  reason?: string;
}

export class PermissionService {
  private static permissions: Permission[] = [
    // Sistema
    { id: 'sys_config', name: 'Configurar Sistema', description: 'Acessar e modificar configurações do sistema', category: 'system', resource: 'system_config', action: 'update' },
    { id: 'sys_backup', name: 'Gerenciar Backup', description: 'Criar e restaurar backups do sistema', category: 'system', resource: 'backup', action: 'create' },
    { id: 'sys_logs', name: 'Visualizar Logs', description: 'Acessar logs do sistema', category: 'system', resource: 'logs', action: 'read' },
    { id: 'sys_users', name: 'Gerenciar Usuários', description: 'Criar, editar e excluir usuários', category: 'users', resource: 'users', action: 'create' },
    
    // Pacientes
    { id: 'patients_create', name: 'Criar Pacientes', description: 'Adicionar novos pacientes', category: 'patients', resource: 'patients', action: 'create' },
    { id: 'patients_read', name: 'Visualizar Pacientes', description: 'Ver lista e detalhes dos pacientes', category: 'patients', resource: 'patients', action: 'read' },
    { id: 'patients_update', name: 'Editar Pacientes', description: 'Modificar dados dos pacientes', category: 'patients', resource: 'patients', action: 'update' },
    { id: 'patients_delete', name: 'Excluir Pacientes', description: 'Remover pacientes do sistema', category: 'patients', resource: 'patients', action: 'delete' },
    { id: 'patients_export', name: 'Exportar Pacientes', description: 'Exportar dados dos pacientes', category: 'patients', resource: 'patients', action: 'export' },
    { id: 'patients_import', name: 'Importar Pacientes', description: 'Importar dados de pacientes via CSV', category: 'patients', resource: 'patients', action: 'import' },
    
    // Sessões
    { id: 'sessions_create', name: 'Agendar Sessões', description: 'Criar novos agendamentos', category: 'sessions', resource: 'sessions', action: 'create' },
    { id: 'sessions_read', name: 'Visualizar Sessões', description: 'Ver agenda e detalhes das sessões', category: 'sessions', resource: 'sessions', action: 'read' },
    { id: 'sessions_update', name: 'Editar Sessões', description: 'Modificar agendamentos existentes', category: 'sessions', resource: 'sessions', action: 'update' },
    { id: 'sessions_delete', name: 'Cancelar Sessões', description: 'Cancelar ou excluir sessões', category: 'sessions', resource: 'sessions', action: 'delete' },
    
    // Pagamentos
    { id: 'payments_create', name: 'Registrar Pagamentos', description: 'Registrar novos pagamentos', category: 'payments', resource: 'payments', action: 'create' },
    { id: 'payments_read', name: 'Visualizar Pagamentos', description: 'Ver histórico de pagamentos', category: 'payments', resource: 'payments', action: 'read' },
    { id: 'payments_update', name: 'Editar Pagamentos', description: 'Modificar dados de pagamentos', category: 'payments', resource: 'payments', action: 'update' },
    { id: 'payments_export', name: 'Exportar Pagamentos', description: 'Exportar relatórios financeiros', category: 'payments', resource: 'payments', action: 'export' },
    
    // Relatórios
    { id: 'reports_read', name: 'Visualizar Relatórios', description: 'Acessar relatórios do sistema', category: 'reports', resource: 'reports', action: 'read' },
    { id: 'reports_export', name: 'Exportar Relatórios', description: 'Gerar e exportar relatórios', category: 'reports', resource: 'reports', action: 'export' },
  ];
  
  private static roles: Role[] = [
    {
      id: 'admin',
      name: 'Administrador',
      description: 'Acesso total ao sistema',
      permissions: this.permissions.map(p => p.id),
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'psychologist',
      name: 'Psicólogo',
      description: 'Acesso completo a pacientes e sessões',
      permissions: [
        'patients_create', 'patients_read', 'patients_update',
        'sessions_create', 'sessions_read', 'sessions_update', 'sessions_delete',
        'payments_read',
        'reports_read'
      ],
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'secretary',
      name: 'Secretária',
      description: 'Acesso a agendamentos e pagamentos',
      permissions: [
        'patients_read', 'patients_create',
        'sessions_create', 'sessions_read', 'sessions_update',
        'payments_create', 'payments_read', 'payments_update'
      ],
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'viewer',
      name: 'Visualizador',
      description: 'Apenas visualização de dados',
      permissions: [
        'patients_read',
        'sessions_read',
        'payments_read',
        'reports_read'
      ],
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  private static userPermissions: UserPermission[] = [];
  private static auditLog: PermissionAudit[] = [];
  
  /**
   * Obtém todas as permissões
   */
  static getAllPermissions(): Permission[] {
    return [...this.permissions];
  }
  
  /**
   * Obtém permissões por categoria
   */
  static getPermissionsByCategory(category: Permission['category']): Permission[] {
    return this.permissions.filter(p => p.category === category);
  }
  
  /**
   * Obtém todas as roles
   */
  static getAllRoles(): Role[] {
    return [...this.roles];
  }
  
  /**
   * Cria uma nova role
   */
  static createRole(name: string, description: string, permissions: string[], performedBy: string): Role {
    const role: Role = {
      id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      permissions,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.roles.push(role);
    
    this.logAudit(
      'role_assigned',
      'system',
      'Sistema',
      performedBy,
      undefined,
      role.id,
      `Role "${name}" criada`
    );
    
    console.log(`👥 Nova role criada: ${name}`);
    return role;
  }
  
  /**
   * Atualiza uma role
   */
  static updateRole(roleId: string, updates: Partial<Role>, performedBy: string): boolean {
    const roleIndex = this.roles.findIndex(r => r.id === roleId);
    
    if (roleIndex === -1 || this.roles[roleIndex].isSystem) {
      return false; // Role não encontrada ou é do sistema
    }
    
    const oldRole = { ...this.roles[roleIndex] };
    this.roles[roleIndex] = {
      ...this.roles[roleIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.logAudit(
      'role_assigned',
      'system',
      'Sistema',
      performedBy,
      undefined,
      roleId,
      `Role "${oldRole.name}" atualizada`
    );
    
    console.log(`👥 Role atualizada: ${this.roles[roleIndex].name}`);
    return true;
  }
  
  /**
   * Remove uma role
   */
  static deleteRole(roleId: string, performedBy: string): boolean {
    const roleIndex = this.roles.findIndex(r => r.id === roleId);
    
    if (roleIndex === -1 || this.roles[roleIndex].isSystem) {
      return false; // Role não encontrada ou é do sistema
    }
    
    const role = this.roles[roleIndex];
    this.roles.splice(roleIndex, 1);
    
    // Remove a role de todos os usuários que a possuem
    this.userPermissions.forEach(user => {
      const roleIndex = user.roles.indexOf(roleId);
      if (roleIndex !== -1) {
        user.roles.splice(roleIndex, 1);
      }
    });
    
    this.logAudit(
      'role_removed',
      'system',
      'Sistema',
      performedBy,
      undefined,
      roleId,
      `Role "${role.name}" removida`
    );
    
    console.log(`👥 Role removida: ${role.name}`);
    return true;
  }
  
  /**
   * Atribui roles a um usuário
   */
  static assignRolesToUser(userId: string, username: string, roles: string[], performedBy: string): void {
    let userPerm = this.userPermissions.find(up => up.userId === userId);
    
    if (!userPerm) {
      userPerm = {
        userId,
        username,
        roles: [],
        permissions: [],
        isActive: true
      };
      this.userPermissions.push(userPerm);
    }
    
    const oldRoles = [...userPerm.roles];
    const uniqueRoles = Array.from(new Set([...userPerm.roles, ...roles]));
    userPerm.roles = uniqueRoles;
    userPerm.permissions = this.calculateUserPermissions(userPerm.roles);
    
    // Log das mudanças
    const newRoles = userPerm.roles.filter(role => !oldRoles.includes(role));
    newRoles.forEach(role => {
      this.logAudit(
        'role_assigned',
        userId,
        username,
        performedBy,
        undefined,
        role,
        `Role atribuída ao usuário`
      );
    });
    
    console.log(`👤 Roles atribuídas ao usuário ${username}: ${newRoles.join(', ')}`);
  }
  
  /**
   * Remove roles de um usuário
   */
  static removeRolesFromUser(userId: string, username: string, roles: string[], performedBy: string): void {
    const userPerm = this.userPermissions.find(up => up.userId === userId);
    
    if (!userPerm) return;
    
    const oldRoles = [...userPerm.roles];
    userPerm.roles = userPerm.roles.filter(role => !roles.includes(role));
    userPerm.permissions = this.calculateUserPermissions(userPerm.roles);
    
    // Log das mudanças
    roles.forEach(role => {
      if (oldRoles.includes(role)) {
        this.logAudit(
          'role_removed',
          userId,
          username,
          performedBy,
          undefined,
          role,
          `Role removida do usuário`
        );
      }
    });
    
    console.log(`👤 Roles removidas do usuário ${username}: ${roles.join(', ')}`);
  }
  
  /**
   * Calcula permissões do usuário baseado nas roles
   */
  private static calculateUserPermissions(roleIds: string[]): string[] {
    const permissions = new Set<string>();
    
    roleIds.forEach(roleId => {
      const role = this.roles.find(r => r.id === roleId);
      if (role) {
        role.permissions.forEach(permission => permissions.add(permission));
      }
    });
    
    return Array.from(permissions);
  }
  
  /**
   * Verifica se usuário tem uma permissão específica
   */
  static hasPermission(userId: string, permissionId: string): boolean {
    const userPerm = this.userPermissions.find(up => up.userId === userId);
    return userPerm ? userPerm.permissions.includes(permissionId) : false;
  }
  
  /**
   * Verifica se usuário tem uma role específica
   */
  static hasRole(userId: string, roleId: string): boolean {
    const userPerm = this.userPermissions.find(up => up.userId === userId);
    return userPerm ? userPerm.roles.includes(roleId) : false;
  }
  
  /**
   * Obtém permissões de um usuário
   */
  static getUserPermissions(userId: string): UserPermission | undefined {
    return this.userPermissions.find(up => up.userId === userId);
  }
  
  /**
   * Obtém todos os usuários com suas permissões
   */
  static getAllUserPermissions(): UserPermission[] {
    return [...this.userPermissions];
  }
  
  /**
   * Registra auditoria de permissões
   */
  private static logAudit(
    action: PermissionAudit['action'],
    userId: string,
    username: string,
    performedBy: string,
    permission?: string,
    role?: string,
    reason?: string
  ): void {
    const audit: PermissionAudit = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      username,
      action,
      permission,
      role,
      timestamp: new Date().toISOString(),
      performedBy,
      reason
    };
    
    this.auditLog.unshift(audit);
    
    // Mantém apenas os últimos 500 registros de auditoria
    if (this.auditLog.length > 500) {
      this.auditLog.splice(500);
    }
  }
  
  /**
   * Obtém log de auditoria
   */
  static getAuditLog(limit?: number): PermissionAudit[] {
    return limit ? this.auditLog.slice(0, limit) : [...this.auditLog];
  }
  
  /**
   * Obtém estatísticas de permissões
   */
  static getPermissionStats(): {
    totalPermissions: number;
    totalRoles: number;
    totalUsers: number;
    activeUsers: number;
    auditEntries: number;
  } {
    return {
      totalPermissions: this.permissions.length,
      totalRoles: this.roles.length,
      totalUsers: this.userPermissions.length,
      activeUsers: this.userPermissions.filter(up => up.isActive).length,
      auditEntries: this.auditLog.length
    };
  }
  
  /**
   * Simula dados de usuários para demonstração
   */
  static seedDemoData(): void {
    // Adiciona alguns usuários de exemplo
    this.assignRolesToUser('user1', 'admin', ['admin'], 'system');
    this.assignRolesToUser('user2', 'psicologo1', ['psychologist'], 'system');
    this.assignRolesToUser('user3', 'secretaria1', ['secretary'], 'system');
    this.assignRolesToUser('user4', 'visualizador1', ['viewer'], 'system');
    
    console.log('🌱 Dados de demonstração de permissões criados');
  }
  
  /**
   * Limpa todos os dados (para testes)
   */
  static clearAllData(): void {
    this.userPermissions = [];
    this.auditLog = [];
    console.log('👥 Dados de permissões limpos');
  }
}
