/**
 * Configurações do Sistema Gestão PSI
 * Configurações estáticas - simples e eficientes
 */

export interface AppConfig {
  // Configurações do Sistema
  systemName: string;
  version: string;
  maintenanceMode: boolean;
  debugMode: boolean;
  
  // Configurações de Backup
  backupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupRetention: number; // em dias
  
  // Configurações de Notificações
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  
  // Configurações de Logs
  logLevel: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  logRetention: number; // em dias
  auditLogs: boolean;
  
  // Configurações de Segurança
  maxLoginAttempts: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  
  // Configurações de Email
  emailEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpFrom: string;
  smtpAuth: boolean;
  smtpTls: boolean;
}

export const APP_CONFIG: AppConfig = {
  // Configurações do Sistema
  systemName: "Gestão PSI",
  version: "1.0.0",
  maintenanceMode: false,
  debugMode: false,
  
  // Configurações de Backup
  backupEnabled: true,
  backupFrequency: 'daily',
  backupRetention: 30,
  
  // Configurações de Notificações
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  
  // Configurações de Logs
  logLevel: 'INFO',
  logRetention: 90,
  auditLogs: true,
  
  // Configurações de Segurança
  maxLoginAttempts: 5,
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  
  // Configurações de Email
  emailEnabled: false,
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUsername: '',
  smtpPassword: '',
  smtpFrom: 'noreply@gestaopsi.com',
  smtpAuth: true,
  smtpTls: true
};

/**
 * Utilitários para trabalhar com configurações
 */
export class ConfigUtils {
  
  /**
   * Verifica se o sistema está em modo de manutenção
   */
  static isMaintenanceMode(): boolean {
    return APP_CONFIG.maintenanceMode;
  }
  
  /**
   * Verifica se o debug está habilitado
   */
  static isDebugMode(): boolean {
    return APP_CONFIG.debugMode;
  }
  
  /**
   * Obtém configuração por chave (para compatibilidade)
   */
  static get(key: string): any {
    const keys = key.split('.');
    let value: any = APP_CONFIG;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return undefined;
      }
    }
    
    return value;
  }
  
  /**
   * Valida política de senha
   */
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const policy = APP_CONFIG.passwordPolicy;
    const errors: string[] = [];
    
    if (password.length < policy.minLength) {
      errors.push(`Senha deve ter pelo menos ${policy.minLength} caracteres`);
    }
    
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    
    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }
    
    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default APP_CONFIG;
