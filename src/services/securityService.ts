/**
 * Serviço de Segurança
 * Implementa funcionalidades reais de segurança
 */

import { APP_CONFIG } from '../config/app-config';

export interface SecurityConfig {
  maxLoginAttempts: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
}

export interface LoginAttempt {
  username: string;
  timestamp: string;
  success: boolean;
  ip?: string;
}

export interface SecurityEvent {
  type: 'login_attempt' | 'password_change' | 'account_lockout' | 'suspicious_activity';
  username: string;
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class SecurityService {
  private static loginAttempts: LoginAttempt[] = [];
  private static securityEvents: SecurityEvent[] = [];
  private static lockedAccounts: Set<string> = new Set();
  
  /**
   * Valida senha baseada na política
   */
  static validatePassword(password: string, policy = APP_CONFIG.passwordPolicy): { valid: boolean; errors: string[] } {
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
  
  /**
   * Registra tentativa de login
   */
  static recordLoginAttempt(username: string, success: boolean): void {
    const attempt: LoginAttempt = {
      username,
      timestamp: new Date().toISOString(),
      success,
      ip: this.getClientIP()
    };
    
    this.loginAttempts.push(attempt);
    
    // Mantém apenas os últimos 100 registros
    if (this.loginAttempts.length > 100) {
      this.loginAttempts.shift();
    }
    
    // Verifica se deve bloquear conta
    if (!success) {
      this.checkAccountLockout(username);
    } else {
      // Remove bloqueio se login foi bem-sucedido
      this.lockedAccounts.delete(username);
    }
    
    // Registra evento de segurança
    this.logSecurityEvent(
      success ? 'login_attempt' : 'login_attempt',
      username,
      success ? 'Login bem-sucedido' : 'Tentativa de login falhada',
      success ? 'low' : 'medium'
    );
  }
  
  /**
   * Verifica se conta deve ser bloqueada
   */
  private static checkAccountLockout(username: string): void {
    const recentAttempts = this.loginAttempts.filter(
      attempt => attempt.username === username && 
      !attempt.success && 
      new Date(attempt.timestamp).getTime() > Date.now() - 15 * 60 * 1000 // Últimos 15 minutos
    );
    
    if (recentAttempts.length >= APP_CONFIG.maxLoginAttempts) {
      this.lockedAccounts.add(username);
      this.logSecurityEvent(
        'account_lockout',
        username,
        `Conta bloqueada após ${recentAttempts.length} tentativas falhadas`,
        'high'
      );
      
      console.warn(`🔒 Conta ${username} bloqueada por excesso de tentativas`);
    }
  }
  
  /**
   * Verifica se conta está bloqueada
   */
  static isAccountLocked(username: string): boolean {
    return this.lockedAccounts.has(username);
  }
  
  /**
   * Desbloqueia conta
   */
  static unlockAccount(username: string): void {
    this.lockedAccounts.delete(username);
    this.logSecurityEvent(
      'account_lockout',
      username,
      'Conta desbloqueada manualmente',
      'medium'
    );
    console.log(`🔓 Conta ${username} desbloqueada`);
  }
  
  /**
   * Registra evento de segurança
   */
  static logSecurityEvent(
    type: SecurityEvent['type'],
    username: string,
    details: string,
    severity: SecurityEvent['severity']
  ): void {
    const event: SecurityEvent = {
      type,
      username,
      timestamp: new Date().toISOString(),
      details,
      severity
    };
    
    this.securityEvents.push(event);
    
    // Mantém apenas os últimos 200 eventos
    if (this.securityEvents.length > 200) {
      this.securityEvents.shift();
    }
    
    // Log baseado na severidade
    const logMessage = `🔐 [${severity.toUpperCase()}] ${type}: ${username} - ${details}`;
    switch (severity) {
      case 'critical':
        console.error(logMessage);
        break;
      case 'high':
        console.warn(logMessage);
        break;
      case 'medium':
        console.info(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }
  
  /**
   * Obtém tentativas de login recentes
   */
  static getRecentLoginAttempts(username?: string): LoginAttempt[] {
    const attempts = username 
      ? this.loginAttempts.filter(a => a.username === username)
      : this.loginAttempts;
    
    return attempts
      .filter(a => new Date(a.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000) // Últimas 24h
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  /**
   * Obtém eventos de segurança recentes
   */
  static getSecurityEvents(severity?: SecurityEvent['severity']): SecurityEvent[] {
    let events = this.securityEvents;
    
    if (severity) {
      events = events.filter(e => e.severity === severity);
    }
    
    return events
      .filter(e => new Date(e.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 dias
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  /**
   * Obtém estatísticas de segurança
   */
  static getSecurityStats(): {
    totalAttempts: number;
    failedAttempts: number;
    lockedAccounts: number;
    criticalEvents: number;
    highEvents: number;
  } {
    const last24h = Date.now() - 24 * 60 * 60 * 1000;
    
    const recentAttempts = this.loginAttempts.filter(
      a => new Date(a.timestamp).getTime() > last24h
    );
    
    const recentEvents = this.securityEvents.filter(
      e => new Date(e.timestamp).getTime() > last24h
    );
    
    return {
      totalAttempts: recentAttempts.length,
      failedAttempts: recentAttempts.filter(a => !a.success).length,
      lockedAccounts: this.lockedAccounts.size,
      criticalEvents: recentEvents.filter(e => e.severity === 'critical').length,
      highEvents: recentEvents.filter(e => e.severity === 'high').length
    };
  }
  
  /**
   * Simula obtenção de IP do cliente
   */
  private static getClientIP(): string {
    // Em um ambiente real, isso viria do servidor
    return '192.168.1.100'; // IP simulado
  }
  
  /**
   * Limpa dados de segurança (para testes)
   */
  static clearSecurityData(): void {
    this.loginAttempts = [];
    this.securityEvents = [];
    this.lockedAccounts.clear();
    console.log('🔐 Dados de segurança limpos');
  }
  
  /**
   * Simula alteração de senha
   */
  static simulatePasswordChange(username: string, newPassword: string): { success: boolean; error?: string } {
    const validation = this.validatePassword(newPassword);
    
    if (!validation.valid) {
      this.logSecurityEvent(
        'password_change',
        username,
        `Tentativa de alteração de senha falhada: ${validation.errors.join(', ')}`,
        'medium'
      );
      return { success: false, error: validation.errors.join(', ') };
    }
    
    this.logSecurityEvent(
      'password_change',
      username,
      'Senha alterada com sucesso',
      'low'
    );
    
    return { success: true };
  }
}

