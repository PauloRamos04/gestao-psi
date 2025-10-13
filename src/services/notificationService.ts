/**
 * Serviço de Notificações
 * Implementa funcionalidades reais de notificações
 */

import { APP_CONFIG } from '../config/app-config';
import { EmailService } from './emailService';

export interface NotificationConfig {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  logLevel: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  logRetention: number;
  auditLogs: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string;
  category: 'system' | 'session' | 'payment' | 'security' | 'backup';
}

export interface LogEntry {
  id: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  message: string;
  timestamp: string;
  category: string;
  userId?: string;
  details?: any;
}

export class NotificationService {
  private static notifications: Notification[] = [];
  private static logs: LogEntry[] = [];
  private static pushPermissionGranted = false;
  
  /**
   * Inicializa o serviço de notificações
   */
  static async initialize(): Promise<void> {
    // Solicita permissão para notificações push
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.pushPermissionGranted = permission === 'granted';
      
      if (this.pushPermissionGranted) {
        this.log('INFO', 'Notificações push habilitadas', 'system');
      } else {
        this.log('WARN', 'Permissão para notificações push negada', 'system');
      }
    }
    
    this.log('INFO', 'Serviço de notificações inicializado', 'system');
  }
  
  /**
   * Cria uma nova notificação
   */
  static createNotification(
    type: Notification['type'],
    title: string,
    message: string,
    category: Notification['category'] = 'system',
    userId?: string
  ): Notification {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      userId,
      category
    };
    
    this.notifications.unshift(notification);
    
    // Mantém apenas os últimos 100 notificações
    if (this.notifications.length > 100) {
      this.notifications.pop();
    }
    
    // Envia notificação push se habilitada
    if (APP_CONFIG.pushNotifications && this.pushPermissionGranted) {
      this.showPushNotification(notification);
    }
    
    // Envia email se habilitado
    if (APP_CONFIG.emailNotifications && category === 'system') {
      this.sendEmailNotification(notification);
    }
    
    return notification;
  }
  
  /**
   * Mostra notificação push no navegador
   */
  private static showPushNotification(notification: Notification): void {
    if ('Notification' in window && this.pushPermissionGranted) {
      const browserNotification = new Notification(`${APP_CONFIG.systemName} - ${notification.title}`, {
        body: notification.message,
        icon: '/logo192.png',
        tag: notification.id
      });
      
      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };
      
      // Auto-close após 5 segundos
      setTimeout(() => browserNotification.close(), 5000);
    }
  }
  
  /**
   * Envia notificação por email
   */
  private static async sendEmailNotification(notification: Notification): Promise<void> {
    try {
      // Simula envio de email para o usuário atual
      const currentUser = 'usuario@exemplo.com'; // Em um app real, viria do contexto
      await EmailService.sendNotification(
        currentUser,
        notification.title,
        notification.message
      );
    } catch (error) {
      this.log('ERROR', `Falha ao enviar email: ${error}`, 'system');
    }
  }
  
  /**
   * Registra log
   */
  static log(
    level: LogEntry['level'],
    message: string,
    category: string = 'system',
    userId?: string,
    details?: any
  ): void {
    // Verifica se deve registrar baseado no nível configurado
    const levels = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
    const currentLevelIndex = levels.indexOf(APP_CONFIG.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    if (messageLevelIndex > currentLevelIndex) {
      return; // Não registra se o nível for menor que o configurado
    }
    
    const logEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      level,
      message,
      timestamp: new Date().toISOString(),
      category,
      userId,
      details
    };
    
    this.logs.unshift(logEntry);
    
    // Mantém apenas os logs dentro do período de retenção
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - APP_CONFIG.logRetention);
    
    this.logs = this.logs.filter(log => 
      new Date(log.timestamp) > retentionDate
    );
    
    // Mantém máximo de 1000 logs
    if (this.logs.length > 1000) {
      this.logs.splice(1000);
    }
    
    // Console log baseado no nível
    const timestamp = new Date().toLocaleString();
    const logMessage = `[${timestamp}] [${level}] [${category}] ${message}`;
    
    switch (level) {
      case 'ERROR':
        console.error(logMessage, details);
        break;
      case 'WARN':
        console.warn(logMessage, details);
        break;
      case 'INFO':
        console.info(logMessage, details);
        break;
      case 'DEBUG':
        console.debug(logMessage, details);
        break;
    }
    
    // Cria notificação para logs de erro e warning
    if (level === 'ERROR' || level === 'WARN') {
      this.createNotification(
        level === 'ERROR' ? 'error' : 'warning',
        `Log ${level}`,
        message,
        'system'
      );
    }
  }
  
  /**
   * Obtém notificações não lidas
   */
  static getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }
  
  /**
   * Obtém todas as notificações
   */
  static getAllNotifications(): Notification[] {
    return [...this.notifications];
  }
  
  /**
   * Marca notificação como lida
   */
  static markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }
  
  /**
   * Marca todas as notificações como lidas
   */
  static markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }
  
  /**
   * Obtém logs filtrados
   */
  static getLogs(filters?: {
    level?: LogEntry['level'];
    category?: string;
    userId?: string;
    limit?: number;
  }): LogEntry[] {
    let filteredLogs = [...this.logs];
    
    if (filters?.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level);
    }
    
    if (filters?.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filters.category);
    }
    
    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }
    
    if (filters?.limit) {
      filteredLogs = filteredLogs.slice(0, filters.limit);
    }
    
    return filteredLogs;
  }
  
  /**
   * Obtém estatísticas de logs
   */
  static getLogStats(): {
    total: number;
    byLevel: Record<LogEntry['level'], number>;
    byCategory: Record<string, number>;
    errorsLast24h: number;
  } {
    const last24h = new Date();
    last24h.setDate(last24h.getDate() - 1);
    
    const recentLogs = this.logs.filter(log => 
      new Date(log.timestamp) > last24h
    );
    
    const byLevel = {
      ERROR: 0,
      WARN: 0,
      INFO: 0,
      DEBUG: 0
    };
    
    const byCategory: Record<string, number> = {};
    
    this.logs.forEach(log => {
      byLevel[log.level]++;
      byCategory[log.category] = (byCategory[log.category] || 0) + 1;
    });
    
    return {
      total: this.logs.length,
      byLevel,
      byCategory,
      errorsLast24h: recentLogs.filter(log => log.level === 'ERROR').length
    };
  }
  
  /**
   * Simula diferentes tipos de notificações
   */
  static simulateNotifications(): void {
    // Notificação de sistema
    this.createNotification(
      'info',
      'Sistema Atualizado',
      'O sistema foi atualizado com novas funcionalidades.',
      'system'
    );
    
    // Notificação de sessão
    this.createNotification(
      'success',
      'Sessão Agendada',
      'Sua sessão foi agendada para amanhã às 14:00.',
      'session'
    );
    
    // Notificação de pagamento
    this.createNotification(
      'warning',
      'Pagamento Pendente',
      'Há um pagamento pendente que vence em 3 dias.',
      'payment'
    );
    
    // Notificação de segurança
    this.createNotification(
      'error',
      'Tentativa de Login Suspeita',
      'Foi detectada uma tentativa de login suspeita na sua conta.',
      'security'
    );
    
    // Logs de exemplo
    this.log('INFO', 'Usuário fez login no sistema', 'authentication');
    this.log('WARN', 'Tentativa de acesso negado', 'security');
    this.log('ERROR', 'Falha ao conectar com o banco de dados', 'database');
    this.log('DEBUG', 'Cache atualizado com sucesso', 'cache');
  }
  
  /**
   * Limpa dados de notificações e logs
   */
  static clearAll(): void {
    this.notifications = [];
    this.logs = [];
    console.log('🔔 Dados de notificações e logs limpos');
  }
}
