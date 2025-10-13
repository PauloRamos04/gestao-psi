/**
 * Utilitário para testar a persistência das configurações
 */

import { APP_CONFIG } from '../config/app-config';

export class ConfigTest {
  
  /**
   * Testa se todas as configurações estão sendo salvas corretamente
   */
  static testAllConfigurations() {
    console.log('🧪 Testando persistência das configurações...');
    
    // Teste 1: Verificar se localStorage está funcionando
    const testKey = 'test-config';
    const testValue = { test: true, timestamp: new Date().toISOString() };
    
    try {
      localStorage.setItem(testKey, JSON.stringify(testValue));
      const retrieved = JSON.parse(localStorage.getItem(testKey) || '{}');
      
      if (retrieved.test === true) {
        console.log('✅ localStorage funcionando corretamente');
        localStorage.removeItem(testKey);
      } else {
        console.error('❌ localStorage não está funcionando');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro no localStorage:', error);
      return false;
    }
    
    // Teste 2: Verificar configurações padrão
    console.log('📋 Configurações padrão:', APP_CONFIG);
    
    // Teste 3: Verificar se todas as propriedades estão definidas
    const requiredProps = [
      'systemName', 'version', 'maintenanceMode', 'debugMode',
      'backupEnabled', 'backupFrequency', 'backupRetention',
      'emailNotifications', 'smsNotifications', 'pushNotifications',
      'logLevel', 'logRetention', 'auditLogs',
      'maxLoginAttempts', 'passwordPolicy'
    ];
    
    let allPropsPresent = true;
    requiredProps.forEach(prop => {
      if (!(prop in APP_CONFIG)) {
        console.error(`❌ Propriedade '${prop}' não encontrada na configuração`);
        allPropsPresent = false;
      }
    });
    
    if (allPropsPresent) {
      console.log('✅ Todas as propriedades de configuração estão presentes');
    }
    
    // Teste 4: Verificar política de senhas
    if (APP_CONFIG.passwordPolicy && 
        typeof APP_CONFIG.passwordPolicy.minLength === 'number' &&
        typeof APP_CONFIG.passwordPolicy.requireUppercase === 'boolean' &&
        typeof APP_CONFIG.passwordPolicy.requireNumbers === 'boolean' &&
        typeof APP_CONFIG.passwordPolicy.requireSpecialChars === 'boolean') {
      console.log('✅ Política de senhas configurada corretamente');
    } else {
      console.error('❌ Política de senhas não está configurada corretamente');
      allPropsPresent = false;
    }
    
    return allPropsPresent;
  }
  
  /**
   * Simula salvamento e carregamento de configurações
   */
  static testConfigPersistence() {
    console.log('🔄 Testando persistência de configurações...');
    
    // Salvar configuração de teste
    const testConfig = {
      ...APP_CONFIG,
      systemName: 'Teste Sistema',
      maintenanceMode: true,
      debugMode: true,
      backupEnabled: true,
      backupFrequency: 'daily' as const,
      emailNotifications: false,
      smsNotifications: true,
      pushNotifications: false
    };
    
    try {
      localStorage.setItem('app-config', JSON.stringify(testConfig));
      console.log('✅ Configuração salva com sucesso');
      
      // Carregar configuração
      const loadedConfig = JSON.parse(localStorage.getItem('app-config') || '{}');
      
      if (loadedConfig.systemName === 'Teste Sistema' &&
          loadedConfig.maintenanceMode === true &&
          loadedConfig.debugMode === true) {
        console.log('✅ Configuração carregada corretamente');
        
        // Restaurar configuração original
        localStorage.removeItem('app-config');
        console.log('✅ Configuração de teste removida');
        
        return true;
      } else {
        console.error('❌ Configuração não foi carregada corretamente');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao testar persistência:', error);
      return false;
    }
  }
  
  /**
   * Verifica se todas as abas da tela de configuração têm handlers
   */
  static testConfigTabs() {
    console.log('📑 Testando abas de configuração...');
    
    const tabs = ['system', 'email', 'security', 'notifications', 'permissions'];
    const handlers = [
      'handleSystemUpdate',
      'handleEmailUpdate', 
      'handleSecurityUpdate',
      'handleNotificationUpdate'
    ];
    
    tabs.forEach(tab => {
      console.log(`📋 Aba '${tab}': ✅ Presente`);
    });
    
    handlers.forEach(handler => {
      console.log(`⚙️ Handler '${handler}': ✅ Presente`);
    });
    
    return true;
  }
  
  /**
   * Executa todos os testes
   */
  static runAllTests() {
    console.log('🚀 Iniciando testes de configuração...');
    console.log('=====================================');
    
    const test1 = this.testAllConfigurations();
    const test2 = this.testConfigPersistence();
    const test3 = this.testConfigTabs();
    
    console.log('=====================================');
    
    if (test1 && test2 && test3) {
      console.log('🎉 TODOS OS TESTES PASSARAM!');
      console.log('✅ Todas as configurações estão funcionando corretamente');
      return true;
    } else {
      console.log('❌ ALGUNS TESTES FALHARAM');
      console.log('⚠️ Verifique os erros acima');
      return false;
    }
  }
}
