/**
 * Serviço de Email Simulado
 * Implementa funcionalidades reais de email para demonstração
 */

import { APP_CONFIG } from '../config/app-config';

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpFrom: string;
  smtpAuth: boolean;
  smtpTls: boolean;
}

export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

export class EmailService {
  private static emailQueue: EmailMessage[] = [];
  private static isProcessing = false;
  
  /**
   * Testa a conexão SMTP (simulado)
   */
  static async testConnection(config: EmailConfig): Promise<EmailResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simula teste de conexão
        if (!config.smtpHost || !config.smtpUsername) {
          resolve({
            success: false,
            error: 'Host SMTP e usuário são obrigatórios',
            timestamp: new Date().toISOString()
          });
          return;
        }
        
        // Simula sucesso após 2 segundos
        resolve({
          success: true,
          messageId: `test-${Date.now()}`,
          timestamp: new Date().toISOString()
        });
      }, 2000);
    });
  }
  
  /**
   * Envia um email (simulado)
   */
  static async sendEmail(message: EmailMessage): Promise<EmailResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simula envio de email
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Log do email enviado
        console.log('📧 Email enviado:', {
          to: message.to,
          subject: message.subject,
          messageId,
          timestamp: new Date().toLocaleString()
        });
        
        // Salva na fila de emails enviados
        this.emailQueue.push(message);
        
        // Limita a fila a 50 emails
        if (this.emailQueue.length > 50) {
          this.emailQueue.shift();
        }
        
        resolve({
          success: true,
          messageId,
          timestamp: new Date().toISOString()
        });
      }, 1000);
    });
  }
  
  /**
   * Envia email de notificação
   */
  static async sendNotification(to: string, subject: string, content: string): Promise<EmailResult> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1890ff; color: white; padding: 20px; text-align: center;">
          <h1>${APP_CONFIG.systemName}</h1>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <h2>${subject}</h2>
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${content.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Este é um email automático do sistema ${APP_CONFIG.systemName}.
          </p>
        </div>
      </div>
    `;
    
    return this.sendEmail({
      to,
      subject: `[${APP_CONFIG.systemName}] ${subject}`,
      body: content,
      html: htmlContent
    });
  }
  
  /**
   * Obtém histórico de emails enviados
   */
  static getEmailHistory(): EmailMessage[] {
    return [...this.emailQueue];
  }
  
  /**
   * Limpa histórico de emails
   */
  static clearHistory(): void {
    this.emailQueue = [];
    console.log('📧 Histórico de emails limpo');
  }
  
  /**
   * Simula envio de email de boas-vindas
   */
  static async sendWelcomeEmail(to: string, username: string): Promise<EmailResult> {
    const subject = 'Bem-vindo ao sistema!';
    const content = `
      Olá ${username},
      
      Bem-vindo ao sistema ${APP_CONFIG.systemName}!
      
      Sua conta foi criada com sucesso e você já pode acessar todas as funcionalidades.
      
      Se você tiver alguma dúvida, não hesite em entrar em contato conosco.
      
      Atenciosamente,
      Equipe ${APP_CONFIG.systemName}
    `;
    
    return this.sendNotification(to, subject, content);
  }
  
  /**
   * Simula envio de email de recuperação de senha
   */
  static async sendPasswordResetEmail(to: string, resetToken: string): Promise<EmailResult> {
    const subject = 'Recuperação de Senha';
    const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;
    const content = `
      Olá,
      
      Você solicitou a recuperação de senha para sua conta no ${APP_CONFIG.systemName}.
      
      Clique no link abaixo para redefinir sua senha:
      ${resetUrl}
      
      Este link expira em 24 horas.
      
      Se você não solicitou esta recuperação, ignore este email.
      
      Atenciosamente,
      Equipe ${APP_CONFIG.systemName}
    `;
    
    return this.sendNotification(to, subject, content);
  }
  
  /**
   * Simula envio de email de lembrete de sessão
   */
  static async sendSessionReminderEmail(to: string, sessionDate: string, sessionTime: string): Promise<EmailResult> {
    const subject = 'Lembrete de Sessão';
    const content = `
      Olá,
      
      Este é um lembrete de que você tem uma sessão agendada:
      
      Data: ${sessionDate}
      Horário: ${sessionTime}
      
      Não se esqueça de comparecer!
      
      Atenciosamente,
      Equipe ${APP_CONFIG.systemName}
    `;
    
    return this.sendNotification(to, subject, content);
  }
}
