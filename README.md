# Instagram Intelligence Dashboard 🚀

Uma plataforma SaaS premium para pesquisa estratégica e monitoramento de nichos no Instagram, potencializada por Inteligência Artificial.

## 🌟 Funcionalidades

- **Busca por Hashtag**: Coleta de dados reais via Instagram Graph API.
- **Análise com IA**: Geração de insights estratégicos (tendências, padrões virais, sugestão de sub-nichos) usando GPT-4o-mini.
- **Dashboard Premium**: Interface de alta fidelidade com modo escuro profundo, animações fluidas e design responsivo.
- **Monitoramento Agendado**: Automação de buscas periódicas para acompanhar o crescimento de nichos.
- **Explorador de Perfis**: Banco de dados de influenciadores e concorrentes descobertos.
- **Analytics Avançado**: Métricas de engajamento e tendências de hashtags.
- **Segurança**: Autenticação robusta com JWT e middlewares de segurança (Helmet, Rate Limit).
- **Performance**: Camada de cache com Redis para respostas ultra-rápidas.

## 🛠️ Stack Tecnológica

### Backend
- **Node.js + TypeScript**
- **Express 5**
- **Prisma ORM** (MySQL)
- **OpenAI SDK**
- **Redis** (Caching)
- **Node-Cron** (Scheduling)

### Frontend
- **Next.js 15** (App Router)
- **Tailwind CSS**
- **Framer Motion** (Animações)
- **Lucide Icons**
- **Zustand** (Gestão de Estado)

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js v18+
- MySQL
- Redis
- Chave de API da OpenAI
- App do Facebook Developers (Instagram Graph API)

### Configuração

1. Clone o repositório
2. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na pasta `backend` com:
     ```env
     DATABASE_URL="mysql://user:pass@localhost:3306/instagram"
     REDIS_URL="redis://localhost:6379"
     JWT_SECRET="seu_segredo_super_seguro"
     OPENAI_API_KEY="sua_chave_openai"
     INSTAGRAM_APP_ID="seu_app_id"
     INSTAGRAM_APP_SECRET="seu_app_secret"
     FRONTEND_URL="http://localhost:3001"
     BACKEND_URL="http://localhost:3000"
     ```

3. Instale as dependências e inicie o projeto:
   ```bash
   # Backend
   cd backend
   npm install
   npx prisma migrate dev
   npm run dev

   # Frontend
   cd ../frontend
   npm install
   npm run dev
   ```

## 📄 Licença
ISC
