# InstaAgent - Frontend Premium 🚀

Este é o frontend de alta performance do Agente de IA para Instagram, construído com foco em estética minimalista e funcionalidade avançada.

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes:** [Shadcn/UI](https://ui.shadcn.com/) + Custom Premium Components
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Gerenciamento de Estado:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Consumo de API:** [Axios](https://axios-http.com/) + [React Query](https://tanstack.com/query/latest)
- **Ícones:** [Lucide React](https://lucide.dev/)

## 🎨 Design System

O projeto utiliza um sistema de design baseado em:
- **Dark Mode Nativo:** Foco em cores profundas (#09090b).
- **Glassmorphism:** Efeitos de desfoque e transparência em cards e sidebars.
- **Tipografia:** Mix de `Inter` (leitura) e `Outfit` (títulos).
- **Feedback Visual:** Micro-interações em todos os botões e estados de loading.

## 📁 Estrutura de Pastas

```text
src/
 ├── app/           # Rotas e Páginas (Next.js App Router)
 ├── components/    # Componentes reutilizáveis (UI, Layout, Shared)
 ├── hooks/         # Hooks customizados
 ├── services/      # Serviços de integração (API)
 ├── store/         # Gerenciamento de estado (Zustand)
 ├── types/         # Definições de TypeScript
 ├── lib/           # Utilitários e configurações (Axios, Utils)
 └── providers/     # Providers (Query, Theme)
```

## 🚀 Como Rodar o Frontend

### 1. Instalar Dependências
Certifique-se de estar na pasta `frontend/` e execute:
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz da pasta `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Rodar em Desenvolvimento
```bash
npm run dev
```
O projeto estará disponível em `http://localhost:3001` (ou na próxima porta disponível).

## 🔗 Conexão com o Backend
O frontend está configurado para se comunicar com o backend via Axios. O token JWT é armazenado de forma segura no `auth-storage` (Zustand Persist) e injetado automaticamente em todas as requisições protegidas.

---
Desenvolvido por **Antigravity AI**.
