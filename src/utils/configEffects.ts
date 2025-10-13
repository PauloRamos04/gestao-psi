/**
 * Efeitos reais das configurações do sistema
 * Implementa funcionalidades que realmente afetam o comportamento
 */

import { APP_CONFIG } from '../config/app-config';

export class ConfigEffects {
  
  /**
   * Aplica o nome do sistema na página
   */
  static applySystemName(systemName: string) {
    // Atualiza o título da página
    document.title = `${systemName} - Sistema de Gestão`;
    
    // Atualiza elementos específicos da página
    const titleElements = document.querySelectorAll('[data-system-name]');
    titleElements.forEach(element => {
      element.textContent = systemName;
    });
    
    // Atualiza o header se existir
    const headerElement = document.querySelector('[data-header-title]');
    if (headerElement) {
      headerElement.textContent = systemName;
    }
  }
  
  /**
   * Aplica modo de manutenção
   */
  static applyMaintenanceMode(enabled: boolean) {
    if (enabled) {
      // Adiciona classe CSS para indicar modo manutenção
      document.body.classList.add('maintenance-mode');
      
      // Cria banner de manutenção se não existir
      if (!document.getElementById('maintenance-banner')) {
        const banner = document.createElement('div');
        banner.id = 'maintenance-banner';
        banner.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #ff4d4f;
          color: white;
          text-align: center;
          padding: 8px;
          z-index: 9999;
          font-weight: bold;
        `;
        banner.textContent = '⚠️ SISTEMA EM MODO DE MANUTENÇÃO';
        document.body.insertBefore(banner, document.body.firstChild);
      }
      
      // Adiciona overlay escuro
      if (!document.getElementById('maintenance-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'maintenance-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 9998;
          pointer-events: none;
        `;
        document.body.appendChild(overlay);
      }
    } else {
      // Remove modo manutenção
      document.body.classList.remove('maintenance-mode');
      
      const banner = document.getElementById('maintenance-banner');
      if (banner) banner.remove();
      
      const overlay = document.getElementById('maintenance-overlay');
      if (overlay) overlay.remove();
    }
  }
  
  /**
   * Aplica modo debug
   */
  static applyDebugMode(enabled: boolean) {
    if (enabled) {
      // Adiciona classe CSS para modo debug
      document.body.classList.add('debug-mode');
      
      // Adiciona console debug visível
      if (!document.getElementById('debug-console')) {
        const debugConsole = document.createElement('div');
        debugConsole.id = 'debug-console';
        debugConsole.style.cssText = `
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: #001529;
          color: #00ff00;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          padding: 10px;
          overflow-y: auto;
          z-index: 1000;
          border-top: 1px solid #1890ff;
        `;
        debugConsole.innerHTML = `
          <div style="color: #1890ff; margin-bottom: 10px;">
            🐛 DEBUG CONSOLE - ${new Date().toLocaleString()}
          </div>
          <div>Sistema em modo debug ativo</div>
        `;
        document.body.appendChild(debugConsole);
      }
      
      // Intercepta console.log para mostrar no debug console
      const originalLog = console.log;
      console.log = (...args) => {
        originalLog(...args);
        const debugConsole = document.getElementById('debug-console');
        if (debugConsole) {
          const logEntry = document.createElement('div');
          logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${args.join(' ')}`;
          debugConsole.appendChild(logEntry);
          debugConsole.scrollTop = debugConsole.scrollHeight;
        }
      };
    } else {
      // Remove modo debug
      document.body.classList.remove('debug-mode');
      
      const debugConsole = document.getElementById('debug-console');
      if (debugConsole) debugConsole.remove();
    }
  }
  
  /**
   * Simula backup automático baseado na frequência
   */
  static scheduleBackup(frequency: string, enabled: boolean) {
    // Remove agendamento anterior se existir
    const existingInterval = (window as any).backupInterval;
    if (existingInterval) {
      clearInterval(existingInterval);
    }
    
    if (!enabled) return;
    
    let intervalMs = 0;
    switch (frequency) {
      case 'daily':
        intervalMs = 24 * 60 * 60 * 1000; // 24 horas
        break;
      case 'weekly':
        intervalMs = 7 * 24 * 60 * 60 * 1000; // 7 dias
        break;
      case 'monthly':
        intervalMs = 30 * 24 * 60 * 60 * 1000; // 30 dias
        break;
    }
    
    if (intervalMs > 0) {
      const backupInterval = setInterval(() => {
        // Simula download de backup
        const backupData = {
          timestamp: new Date().toISOString(),
          systemName: APP_CONFIG.systemName,
          version: APP_CONFIG.version,
          data: 'Simulação de dados do sistema...'
        };
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
      }, intervalMs);
      
      (window as any).backupInterval = backupInterval;
    }
  }
  
  /**
   * Aplica todas as configurações
   */
  static applyAllConfig(config: any) {
    this.applySystemName(config.systemName);
    this.applyMaintenanceMode(config.maintenanceMode);
    this.applyDebugMode(config.debugMode);
    this.scheduleBackup(config.backupFrequency, config.backupEnabled);
  }
}
