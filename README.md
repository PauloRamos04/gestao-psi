# Gestão PSI - Frontend

Sistema de Gestão para Clínicas de Psicologia - Interface React com TypeScript.

## 🚀 Funcionalidades Implementadas

### ✅ **Sistema de Autenticação**
- Login com JWT
- Proteção de rotas
- Contexto de autenticação global
- Logout automático

### ✅ **Dashboard Principal**
- Estatísticas em tempo real
- Sessões do dia
- Faturamento do mês
- Mensagens importantes
- Design responsivo

### ✅ **Gestão de Usuários**
- Lista completa de usuários
- Ativação/Desativação de usuários
- Busca por nome, clínica ou psicólogo
- Status visual dos usuários

### ✅ **Gestão de Sessões**
- Visualização por dia ou período
- Filtros avançados
- Status das sessões
- Informações detalhadas

### ✅ **Design Moderno e Responsivo**
- Tailwind CSS
- Componentes reutilizáveis
- Interface mobile-first
- Tema personalizado

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Axios** para requisições HTTP
- **React Hook Form** para formulários
- **Lucide React** para ícones
- **Date-fns** para manipulação de datas

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Backend rodando em http://localhost:8080

### Instalação
```bash
cd prd-front
npm install
```

### Execução
```bash
npm start
```

O aplicativo estará disponível em: http://localhost:3000

## 🎯 Funcionalidades por Página

### 🔐 **Login** (`/login`)
- Autenticação segura
- Validação de formulário
- Feedback de erro
- Design moderno

### 📊 **Dashboard** (`/dashboard`)
- Cards com estatísticas
- Sessões do dia
- Mensagens importantes
- Informações do usuário

### 👥 **Usuários** (`/usuarios`)
- Lista paginada
- Busca em tempo real
- Ativação/Desativação
- Informações detalhadas

### 📅 **Sessões** (`/sessoes`)
- Filtro por dia ou período
- Lista com status
- Informações do paciente
- Localização da sala

### 💰 **Pagamentos** (`/pagamentos`)
- Lista por período
- Valores e datas
- Status dos pagamentos

### 📈 **Faturamento** (`/faturamento`)
- Relatórios por período
- Gráficos de receita
- Comparativos mensais

### 💬 **Mensagens** (`/mensagens`)
- Mensagens ativas
- Sistema de notificações
- Priorização de conteúdo

### 🏥 **Clínicas** (`/clinicas`)
- Informações das clínicas
- Status de funcionamento

### 🏢 **Salas** (`/salas`)
- Lista de salas por clínica
- Disponibilidade
- Capacidade

## 🔧 Configuração da API

O frontend está configurado para se comunicar com o backend em:
- **URL Base:** `http://localhost:8080/api`
- **Autenticação:** JWT Bearer Token
- **CORS:** Configurado para desenvolvimento

## 📱 Responsividade

- **Mobile First:** Design otimizado para dispositivos móveis
- **Breakpoints:** sm, md, lg, xl
- **Sidebar:** Colapsível em telas pequenas
- **Tabelas:** Scroll horizontal em mobile

## 🎨 Design System

### Cores
- **Primary:** Azul (#3b82f6)
- **Secondary:** Cinza (#64748b)
- **Success:** Verde (#10b981)
- **Warning:** Amarelo (#f59e0b)
- **Error:** Vermelho (#ef4444)

### Tipografia
- **Fonte:** Inter (Google Fonts)
- **Pesos:** 300, 400, 500, 600, 700

### Componentes
- Botões com estados hover/focus
- Cards com sombras sutis
- Formulários com validação visual
- Tabelas responsivas
- Modais e overlays

## 🔒 Segurança

- **JWT Token:** Armazenado no localStorage
- **Interceptors:** Renovação automática de token
- **Proteção de Rotas:** Redirecionamento para login
- **Validação:** Formulários com validação client-side

## 🚀 Próximos Passos

### Funcionalidades em Desenvolvimento
- [ ] Formulários de criação/edição
- [ ] Upload de arquivos
- [ ] Gráficos avançados
- [ ] Notificações push
- [ ] Modo escuro
- [ ] Internacionalização

### Melhorias Planejadas
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] PWA (Progressive Web App)
- [ ] Cache offline
- [ ] Performance optimization

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se o backend está rodando
2. Confirme as configurações de CORS
3. Verifique os logs do console do navegador
4. Consulte a documentação da API

---

**Desenvolvido com ❤️ para Gestão PSI**