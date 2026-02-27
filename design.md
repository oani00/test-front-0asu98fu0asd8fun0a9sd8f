# Design e Arquitetura - Plataforma de Excursões Locais

## 📋 Visão Geral do Projeto

A **Plataforma de Excursões Locais** é um aplicativo web desenvolvido em Angular 17 para gerenciamento de passeios turísticos oferecidos por microempresas. O sistema conecta operadores turísticos locais com viajantes interessados em experiências turísticas regionais, com foco em passeios de um dia e viagens de vários dias.

### 🎯 Propósito
- **Para Microempresas**: Plataforma para gerenciar e promover passeios com 1-2 ônibus
- **Para Viajantes**: Descobrir e reservar experiências turísticas locais
- **Para Atrações**: Maior visibilidade e alcance de público

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico
- **Frontend**: Angular 17 (componentes standalone)
- **Backend**: Node.js + Express + MongoDB
- **UI Framework**: Bootstrap 5.3.2 + ng-bootstrap
- **Linguagem**: TypeScript 5.4.2
- **Programação Reativa**: RxJS 7.8.0
- **Gerenciamento de Estado**: LocalStorage (temporário)

### Estrutura de Diretórios
```
src/app/
├── components/          # Componentes reutilizáveis
│   └── navbar/         # Navegação principal
├── models/             # Modelos de dados TypeScript
│   └── excursion.ts    # Interface principal
├── pages/              # Páginas/componentes de rota
│   ├── initial-page/   # Landing page
│   ├── menu-general/   # Menu principal de navegação
│   ├── excursion-detail/ # Detalhes de excursão
│   ├── login/          # Autenticação
│   ├── sign-up/        # Cadastro de usuários
│   ├── support/        # Suporte ao cliente
│   ├── user/           # Página do usuário (excursões e perfil)
│   └── admin/          # Painel administrativo
├── services/           # Lógica de negócio e API
│   ├── excursion.service.ts    # CRUD de excursões
│   ├── login.service.ts        # Autenticação
│   ├── admin.service.ts        # Operações admin
│   └── avatar.service.ts       # Gestão de perfil
└── types/              # Definições TypeScript
```

## 🎨 Design System

### Paleta de Cores
- **Verde Claro**: `#b0d9c1` - Fundo principal
- **Verde Escuro**: `#0f5f51` - Botões primários
- **Verde Muito Escuro**: `#083c33` - Textos principais
- **Laranja**: `orange` - Destaques e títulos
- **Branco**: `#ffffff` - Textos em botões

### Componentes de UI

#### Botões Verticais
```css
.vertical-button {
  background-color: #0f5f51;
  color: #ffffff;
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 18px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  transition: background-color 0.2s ease;
}
```

#### Navbar
- Ícone de menu hambúrguer (SVG)
- Logo centralizado
- Avatar do usuário (imagem de perfil ou emoji 👤 como fallback) + nome
- Botão de logout quando autenticado
- Avatar sincronizado automaticamente após login/upload de foto

## 📊 Modelo de Dados

### Excursion Interface
```typescript
interface Excursion {
  _id?: string;           // MongoDB ObjectId
  name: string;           // Nome da excursão (obrigatório)
  description?: string;   // Descrição detalhada
  date?: Date;           // Data do passeio/viagem
  location?: string;     // Localização
  price?: number;        // Preço por pessoa
  type: 'passeio' | 'viagem'; // Tipo de experiência
  pictures?: string[];   // URLs das imagens
  users?: string[];      // IDs dos participantes
}
```

### Tipos de Experiência
1. **Passeios**: Experiências intradia (museus, atrações locais, city tours)
2. **Viagens**: Experiências de múltiplos dias (finais de semana, tours prolongados)

### User Interface
```typescript
interface User {
  id: string;           // MongoDB ObjectId
  name: string;         // Nome do usuário
  email: string;        // Email único
  type?: 'user' | 'admin'; // Tipo de usuário
  picture?: string | null; // ID da foto de perfil (referência ao Picture)
}
```

## 🚀 Funcionalidades Principais

### ✅ Implementado

#### Sistema de Autenticação
- Login com email/senha
- Cadastro de novos usuários
- Logout funcional
- Verificação de tipo de usuário (user/admin)
- Armazenamento temporário no localStorage
- Resposta de login inclui `type` e `picture` (ID da foto de perfil)
- Sincronização automática de avatar após login

#### Catálogo de Excursões
- Listagem de passeios e viagens
- Filtros por tipo (passeio/viagem)
- Navegação para detalhes
- Estados vazios informativos

#### Detalhes da Excursão
- Informações completas da experiência
- Preço por pessoa
- Data formatada
- Lista de itens incluídos
- Design responsivo básico

#### Perfil do Usuário
- Sistema de avatar com upload de fotos de perfil
- Upload de imagem na página do usuário (`/user`)
- Avatar exibido na navbar (imagem real ou emoji 👤 como fallback)
- Sincronização automática do avatar após login e upload
- Gestão de perfil integrada com localStorage
- Visualização e gerenciamento de excursões inscritas
- Remoção de excursões (desinscrição)

#### AvatarService
- Serviço centralizado para gerenciamento de avatares
- `syncWithStoredUser()`: Sincroniza avatar com dados do localStorage
- `avatarUrl$`: Observable que emite data URL da imagem quando disponível
- `emoji$`: Observable que emite emoji fallback (👤) quando não há imagem
- Carregamento automático de imagem do backend via `GET /pictures/:id`
- Conversão de blob para data URL para exibição
- Integração reativa com componentes via BehaviorSubject

#### Página do Usuário (`/user`)
- Upload de foto de perfil via input de arquivo
- Validação de tipo de arquivo (apenas imagens)
- Feedback visual durante upload (mensagens de sucesso/erro)
- Atualização automática do localStorage após upload bem-sucedido
- Sincronização do avatar na navbar após upload
- Listagem de excursões nas quais o usuário está inscrito
- Funcionalidade de desinscrição de excursões
- Acesso restrito apenas para usuários não-administradores

#### Painel Administrativo
- CRUD completo de excursões
- Edição inline de registros
- Criação de novas experiências
- Gestão de usuários (promoção/rebaixamento)
- Filtros administrativos
- Controle de acesso baseado em tipo

### 🔄 Em Desenvolvimento
- Carrossel na página inicial
- Integração com WhatsApp
- Dashboard administrativo avançado
- Validação de formulários
- Tratamento de erros abrangente
- Edição de perfil completa (nome, email, etc.)

## 👥 Fluxos de Usuário

### Viajante (Usuário Regular)
1. **Landing Page** → Visualiza imagens promocionais
2. **Login/Cadastro** → Autenticação e criação de conta
3. **Menu Principal** → Escolhe entre Passeios ou Viagens
4. **Listagem** → Navega catálogo filtrado
5. **Detalhes** → Visualiza informações completas
6. **Página do Usuário** → Gerencia perfil (upload de foto) e excursões inscritas
7. **Reserva** → Processo de booking (planejado)

### Operador/Admin
1. **Login** → Autenticação como administrador
2. **Painel Admin** → Acesso ao dashboard
3. **Gerenciar Excursões** → CRUD de experiências
4. **Gerenciar Usuários** → Controle de permissões

### 🔑 Como Acessar a Página de Administração
1. **URL Direta**: Navegue para `/admin` (ex: `http://localhost:4200/admin`)
2. **Rota**: Definida em `src/app/app.routes.ts` como `{ path: 'admin', component: AdminPageComponent }`
3. **Requisitos de Acesso**:
   - Estar logado com uma conta de usuário
   - O usuário deve ter `type: 'admin'` no perfil armazenado no localStorage
   - Caso contrário, a mensagem "Acesso restrito: somente administradores" será exibida
4. **Nota**: Atualmente não há link direto na navbar para a página admin - acesso apenas via URL manual

### 👤 Como Acessar a Página do Usuário
1. **URL Direta**: Navegue para `/user` (ex: `http://localhost:4200/user`)
2. **Rota**: Definida em `src/app/app.routes.ts` como `{ path: 'user', component: UserComponent }`
3. **Requisitos de Acesso**:
   - Estar logado com uma conta de usuário
   - O usuário deve ter `type: 'user'` (não admin) no perfil armazenado no localStorage
   - Caso contrário, a mensagem "Esta página é apenas para usuários não-administradores" será exibida
4. **Funcionalidades**:
   - Upload de foto de perfil
   - Visualização de excursões inscritas
   - Desinscrição de excursões

## 🔐 Segurança e Autenticação

### Estado Atual
- Autenticação baseada em localStorage
- Verificação de tipo de usuário no frontend
- Tokens JWT não implementados (planejado)
- Controle de acesso baseado em propriedades do usuário

### Melhorias Planejadas
- Implementação completa de JWT
- Guards de rota para proteção
- Refresh tokens
- Validação de sessão no backend

## 📱 Design Responsivo

### Abordagem
- Bootstrap 5.3.2 como framework base
- Classes utilitárias para breakpoints
- Layout flexível e adaptativo
- Componentes mobile-first

### Estados de Layout
- **Mobile**: Interface vertical, botões empilhados
- **Tablet**: Layout intermediário
- **Desktop**: Interface expandida (planejado)

## 🔗 Integrações

### Backend API
- **Base URL**: `http://localhost:3000` (desenvolvimento)
- **Endpoints**:
  - `GET /excursions` - Listar todas as excursões
  - `GET /excursions/:id` - Detalhes de uma excursão
  - `POST /SignUp/login/0` - Autenticação (retorna `user` com `type` e `picture`)
  - `POST /excursions` - Criar excursão (admin)
  - `PUT /excursions/:id` - Atualizar excursão (admin)
  - `DELETE /excursions/:id` - Deletar excursão (admin)
  - `PUT /users/:id/change-type` - Alterar tipo de usuário (admin)
  - `POST /users/:id/picture` - Upload de foto de perfil (multipart/form-data)
  - `GET /pictures/:id` - Obter imagem de perfil por ID
  - `POST /users/:userId/subscribe/:excursionId` - Inscrever usuário em excursão
  - `POST /users/:userId/unsubscribe/:excursionId` - Desinscrever usuário de excursão

### Serviços Externos (Planejados)
- WhatsApp Business API
- Sistema de pagamentos
- API de mapas para localização
- Serviço de notificações

## 🧪 Qualidade e Testes

### Estratégia de Testes
- Testes unitários com Jasmine/Karma
- Cobertura de componentes críticos
- Testes de integração para serviços
- Testes E2E (planejados)

### Padrões de Código
- Componentes Angular standalone
- TypeScript com strict mode
- Programação reativa com RxJS
- Estilização com classes Bootstrap

## 🚀 Roadmap e Próximas Etapas

### Meta: Novembro 2025

#### Sprint Atual
- [ ] Padronização completa de estilos
- [ ] Implementação de validação de formulários
- [ ] Melhorias na experiência do usuário
- [ ] Tratamento robusto de erros

#### Próximas Funcionalidades
- [ ] Carrossel interativo na landing page
- [ ] Sistema de reservas e pagamentos
- [ ] Dashboard administrativo avançado
- [ ] Integração com WhatsApp
- [ ] Notificações push
- [ ] Sistema de avaliações

#### Otimizações Técnicas
- [ ] Implementação de JWT completa
- [ ] Guards de autenticação
- [ ] Cache inteligente de dados
- [ ] Progressive Web App (PWA)
- [ ] Otimização de performance

## 📈 Métricas de Sucesso

### KPIs de Negócio
- Número de excursões cadastradas
- Taxa de conversão de visitantes em reservas
- Satisfação dos operadores turísticos
- Tempo médio de resposta no suporte

### KPIs Técnicos
- Tempo de carregamento das páginas
- Taxa de erro das requisições API
- Cobertura de testes automatizados
- Performance em dispositivos móveis

## 🎯 Princípios de Design

### Experiência do Usuário
- **Simplicidade**: Interface intuitiva e direta
- **Consistência**: Padrões visuais uniformes
- **Acessibilidade**: Design inclusivo
- **Performance**: Carregamento rápido e responsivo

### Arquitetura
- **Modularidade**: Componentes independentes
- **Reutilização**: Código compartilhável
- **Manutenibilidade**: Estrutura organizada
- **Escalabilidade**: Preparado para crescimento

---

*Este documento reflete o estado atual do projeto em desenvolvimento e será atualizado conforme novas funcionalidades forem implementadas.*
