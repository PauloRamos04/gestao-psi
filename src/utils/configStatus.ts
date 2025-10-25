/**
 * Status das configurações do sistema
 * Verifica se todas as opções estão funcionando de forma persistente
 */

export interface ConfigStatus {
  tab: string;
  field: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  persistent: boolean;
  functional: boolean;
  description: string;
}

export const CONFIG_STATUS: ConfigStatus[] = [
  // ABA SISTEMA
  {
    tab: 'system',
    field: 'systemName',
    type: 'text',
    persistent: true,
    functional: true,
    description: 'Nome do sistema - Altera título da página e elementos visuais'
  },
  {
    tab: 'system',
    field: 'version',
    type: 'text',
    persistent: true,
    functional: true,
    description: 'Versão do sistema - Exibida na interface'
  },
  {
    tab: 'system',
    field: 'maintenanceMode',
    type: 'boolean',
    persistent: true,
    functional: true,
    description: 'Modo manutenção - Adiciona banner vermelho e overlay escuro'
  },
  {
    tab: 'system',
    field: 'debugMode',
    type: 'boolean',
    persistent: true,
    functional: true,
    description: 'Modo debug - Adiciona console debug na parte inferior'
  },
  {
    tab: 'system',
    field: 'backupEnabled',
    type: 'boolean',
    persistent: true,
    functional: true,
    description: 'Backup automático - Agenda downloads baseado na frequência'
  },
  {
    tab: 'system',
    field: 'backupFrequency',
    type: 'select',
    persistent: true,
    functional: true,
    description: 'Frequência do backup - Controla intervalo dos downloads automáticos'
  },
  {
    tab: 'system',
    field: 'backupRetention',
    type: 'number',
    persistent: true,
    functional: true,
    description: 'Retenção de backup - Configuração salva (não implementada funcionalmente)'
  },

  // ABA EMAIL
  {
    tab: 'email',
    field: 'emailEnabled',
    type: 'boolean',
    persistent: true,
    functional: false,
    description: 'Email habilitado - Configuração salva (sistema de email não implementado)'
  },
  {
    tab: 'email',
    field: 'smtpHost',
    type: 'text',
    persistent: true,
    functional: false,
    description: 'Servidor SMTP - Configuração salva (sistema de email não implementado)'
  },
  {
    tab: 'email',
    field: 'smtpPort',
    type: 'number',
    persistent: true,
    functional: false,
    description: 'Porta SMTP - Configuração salva (sistema de email não implementado)'
  },
  {
    tab: 'email',
    field: 'smtpUsername',
    type: 'text',
    persistent: true,
    functional: false,
    description: 'Usuário SMTP - Configuração salva (sistema de email não implementado)'
  },
  {
    tab: 'email',
    field: 'smtpFrom',
    type: 'text',
    persistent: true,
    functional: false,
    description: 'Email remetente - Configuração salva (sistema de email não implementado)'
  },

  // ABA SEGURANÇA
  {
    tab: 'security',
    field: 'maxLoginAttempts',
    type: 'number',
    persistent: true,
    functional: false,
    description: 'Máximo tentativas login - Configuração salva (não integrada com auth)'
  },
  {
    tab: 'security',
    field: 'minLength',
    type: 'number',
    persistent: true,
    functional: true,
    description: 'Tamanho mínimo senha - Usado na validação de senhas'
  },
  {
    tab: 'security',
    field: 'requireUppercase',
    type: 'boolean',
    persistent: true,
    functional: true,
    description: 'Exigir maiúsculas - Usado na validação de senhas'
  },
  {
    tab: 'security',
    field: 'requireNumbers',
    type: 'boolean',
    persistent: true,
    functional: true,
    description: 'Exigir números - Usado na validação de senhas'
  },
  {
    tab: 'security',
    field: 'requireSpecialChars',
    type: 'boolean',
    persistent: true,
    functional: true,
    description: 'Exigir caracteres especiais - Usado na validação de senhas'
  },

  // ABA NOTIFICAÇÕES
  {
    tab: 'notifications',
    field: 'emailNotifications',
    type: 'boolean',
    persistent: true,
    functional: false,
    description: 'Notificações email - Configuração salva (sistema não implementado)'
  },
  {
    tab: 'notifications',
    field: 'smsNotifications',
    type: 'boolean',
    persistent: true,
    functional: false,
    description: 'Notificações SMS - Configuração salva (sistema não implementado)'
  },
  {
    tab: 'notifications',
    field: 'pushNotifications',
    type: 'boolean',
    persistent: true,
    functional: false,
    description: 'Notificações push - Configuração salva (sistema não implementado)'
  },
  {
    tab: 'notifications',
    field: 'logLevel',
    type: 'select',
    persistent: true,
    functional: false,
    description: 'Nível de log - Configuração salva (não integrada com backend)'
  },
  {
    tab: 'notifications',
    field: 'logRetention',
    type: 'number',
    persistent: true,
    functional: false,
    description: 'Retenção de logs - Configuração salva (não integrada com backend)'
  },
  {
    tab: 'notifications',
    field: 'auditLogs',
    type: 'boolean',
    persistent: true,
    functional: false,
    description: 'Logs de auditoria - Configuração salva (não integrada com backend)'
  }
];

export class ConfigStatusChecker {
  
  /**
   * Obtém status de uma configuração específica
   */
  static getConfigStatus(tab: string, field: string): ConfigStatus | undefined {
    return CONFIG_STATUS.find(config => config.tab === tab && config.field === field);
  }
  
  /**
   * Obtém todas as configurações de uma aba
   */
  static getTabStatus(tab: string): ConfigStatus[] {
    return CONFIG_STATUS.filter(config => config.tab === tab);
  }
  
  /**
   * Conta configurações funcionais vs não funcionais
   */
  static getSummary() {
    const total = CONFIG_STATUS.length;
    const functional = CONFIG_STATUS.filter(c => c.functional).length;
    const persistent = CONFIG_STATUS.filter(c => c.persistent).length;
    
    return {
      total,
      functional,
      nonFunctional: total - functional,
      persistent,
      nonPersistent: total - persistent,
      functionalPercentage: Math.round((functional / total) * 100),
      persistentPercentage: Math.round((persistent / total) * 100)
    };
  }
  
  /**
   * Gera relatório completo
   */
  static generateReport() {
    const summary = this.getSummary();
    
    console.log('📊 RELATÓRIO DE CONFIGURAÇÕES');
    console.log('=============================');
    console.log(`Total de configurações: ${summary.total}`);
    console.log(`Funcionais: ${summary.functional} (${summary.functionalPercentage}%)`);
    console.log(`Não funcionais: ${summary.nonFunctional}`);
    console.log(`Persistentes: ${summary.persistent} (${summary.persistentPercentage}%)`);
    console.log(`Não persistentes: ${summary.nonPersistent}`);
    console.log('');
    
    // Por aba
    const tabs = ['system', 'email', 'security', 'notifications'];
    tabs.forEach(tab => {
      const tabConfigs = this.getTabStatus(tab);
      const functional = tabConfigs.filter(c => c.functional).length;
      const persistent = tabConfigs.filter(c => c.persistent).length;
      
      console.log(`📋 Aba ${tab.toUpperCase()}:`);
      console.log(`   Funcionais: ${functional}/${tabConfigs.length}`);
      console.log(`   Persistentes: ${persistent}/${tabConfigs.length}`);
    });
    
    console.log('=============================');
    
    return summary;
  }
}

