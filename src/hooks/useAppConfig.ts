import { useState, useCallback } from 'react';
import { APP_CONFIG, AppConfig, ConfigUtils } from '../config/app-config';
import { ConfigEffects } from '../utils/configEffects';

/**
 * Hook para gerenciar configurações do sistema
 * Simula persistência usando localStorage
 */
export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfig>(() => {
    // Tenta carregar do localStorage, senão usa o padrão
    try {
      const saved = localStorage.getItem('app-config');
      if (saved) {
        const loadedConfig = { ...APP_CONFIG, ...JSON.parse(saved) };
        // Aplica as configurações carregadas
        setTimeout(() => ConfigEffects.applyAllConfig(loadedConfig), 100);
        return loadedConfig;
      }
    } catch (error) {
      console.warn('Erro ao carregar configurações do localStorage:', error);
    }
    return APP_CONFIG;
  });

  /**
   * Atualiza uma configuração específica
   */
  const updateConfig = useCallback((key: string, value: any) => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig } as any;
      const keys = key.split('.');
      let current: any = newConfig;
      
      // Navega até o objeto pai
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Define o valor
      current[keys[keys.length - 1]] = value;
      
      // Salva no localStorage
      try {
        localStorage.setItem('app-config', JSON.stringify(newConfig));
      } catch (error) {
        console.warn('Erro ao salvar configurações no localStorage:', error);
      }
      
      // Aplica efeitos imediatos
      setTimeout(() => ConfigEffects.applyAllConfig(newConfig), 100);
      
      return newConfig as AppConfig;
    });
  }, []);

  /**
   * Atualiza múltiplas configurações
   */
  const updateConfigs = useCallback((updates: Partial<AppConfig>) => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig, ...updates };
      
      // Salva no localStorage
      try {
        localStorage.setItem('app-config', JSON.stringify(newConfig));
      } catch (error) {
        console.warn('Erro ao salvar configurações no localStorage:', error);
      }
      
      // Aplica efeitos imediatos
      setTimeout(() => ConfigEffects.applyAllConfig(newConfig), 100);
      
      return newConfig;
    });
  }, []);

  /**
   * Reseta para configurações padrão
   */
  const resetConfig = useCallback(() => {
    setConfig(APP_CONFIG);
    try {
      localStorage.removeItem('app-config');
    } catch (error) {
      console.warn('Erro ao remover configurações do localStorage:', error);
    }
  }, []);

  /**
   * Salva configurações (para compatibilidade com a interface existente)
   */
  const saveConfig = useCallback((category: string, configs: Record<string, any>) => {
    const updates: Partial<AppConfig> = {};
    
    switch (category) {
      case 'system':
        updates.systemName = configs.systemName;
        updates.version = configs.version;
        updates.maintenanceMode = configs.maintenanceMode;
        updates.debugMode = configs.debugMode;
        updates.backupEnabled = configs.backupEnabled;
        updates.backupFrequency = configs.backupFrequency;
        updates.backupRetention = configs.backupRetention;
        break;
        
      case 'email':
        updates.emailEnabled = configs.emailEnabled;
        updates.smtpHost = configs.smtpHost;
        updates.smtpPort = configs.smtpPort;
        updates.smtpUsername = configs.smtpUsername;
        updates.smtpPassword = configs.smtpPassword;
        updates.smtpFrom = configs.smtpFrom;
        updates.smtpAuth = configs.smtpAuth;
        updates.smtpTls = configs.smtpTls;
        break;
        
      case 'security':
        updates.maxLoginAttempts = configs.maxLoginAttempts;
        updates.passwordPolicy = {
          minLength: configs.minLength || 8,
          requireUppercase: configs.requireUppercase || false,
          requireNumbers: configs.requireNumbers || false,
          requireSpecialChars: configs.requireSpecialChars || false
        };
        break;
        
      case 'notifications':
        updates.emailNotifications = configs.emailNotifications;
        updates.smsNotifications = configs.smsNotifications;
        updates.pushNotifications = configs.pushNotifications;
        updates.logLevel = configs.logLevel;
        updates.logRetention = configs.logRetention;
        updates.auditLogs = configs.auditLogs;
        break;
    }
    
    updateConfigs(updates);
  }, [updateConfigs]);

  return {
    config,
    updateConfig,
    updateConfigs,
    resetConfig,
    saveConfig,
    // Utilitários
    isMaintenanceMode: () => ConfigUtils.isMaintenanceMode(),
    isDebugMode: () => ConfigUtils.isDebugMode(),
    validatePassword: (password: string) => ConfigUtils.validatePassword(password)
  };
};
