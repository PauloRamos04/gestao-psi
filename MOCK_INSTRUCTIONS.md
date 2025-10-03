# 🎭 Frontend com Dados Mockados

O frontend está configurado para funcionar com dados mockados, permitindo que você visualize toda a interface sem precisar do backend funcionando.

## 🔑 **Credenciais de Login**

Para acessar o sistema, use estas credenciais:

```
Usuário: admin
Senha: admin
```

## 📊 **Dados Mockados Disponíveis**

### **Usuários (3 usuários)**
- Dr. João Silva (Ativo)
- Dra. Maria Santos (Ativo) 
- Dr. Pedro Costa (Inativo)

### **Pacientes (3 pacientes)**
- Ana Carolina
- Bruno Oliveira
- Carla Mendes

### **Sessões**
- 2 sessões para hoje
- 1 sessão para amanhã
- Status: ATIVA

### **Salas (3 salas)**
- Sala 1 - Individual
- Sala 2 - Casal
- Sala 3 - Grupo

### **Pagamentos**
- R$ 150,00 (Ana Carolina)
- R$ 180,00 (Bruno Oliveira)

### **Mensagens (3 mensagens)**
- Atualização do Sistema
- Nova Funcionalidade
- Lembrete: Backup

## 🎯 **Funcionalidades Testáveis**

### ✅ **Login**
- Use as credenciais acima
- Simula delay de rede (1 segundo)
- Redireciona para o dashboard

### ✅ **Dashboard**
- Estatísticas em tempo real
- Sessões de hoje (2 sessões)
- Faturamento do mês (R$ 330,00)
- Mensagens importantes (3 mensagens)

### ✅ **Usuários**
- Lista com 3 usuários
- Busca funcional
- Ativar/Desativar usuários (funciona!)
- Status visual

### ✅ **Sessões**
- Filtro por dia (hoje)
- Filtro por período
- Lista com informações completas
- Status das sessões

### ✅ **Navegação**
- Sidebar responsiva
- Todas as rotas funcionando
- Proteção de rotas
- Logout funcional

## 🔧 **Como Desativar o Mock**

Quando o backend estiver funcionando, edite o arquivo:

`src/services/api.ts`

```typescript
private useMock: boolean = false; // Mude para false
```

## 📱 **Interface Responsiva**

- **Desktop**: Sidebar fixa à esquerda
- **Mobile**: Sidebar colapsível
- **Tablet**: Layout adaptativo

## 🎨 **Design Features**

- **Tema**: Azul e cinza profissional
- **Tipografia**: Inter (Google Fonts)
- **Ícones**: Lucide React
- **Animações**: Loading states e transições
- **Estados**: Hover, focus, active

## 🚀 **Próximos Passos**

1. **Teste todas as funcionalidades**
2. **Navegue entre as páginas**
3. **Teste a responsividade**
4. **Verifique os filtros e buscas**
5. **Teste ativação/desativação de usuários**

## 💡 **Dicas**

- Os dados são persistidos durante a sessão
- As alterações (como ativar/desativar usuários) são visíveis imediatamente
- O sistema simula delays de rede realistas
- Todos os componentes estão totalmente funcionais

---

**Aproveite para explorar a interface! 🎉**
