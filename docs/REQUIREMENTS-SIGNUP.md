# Requisitos atendidos – Sign up e fluxo de acesso

## Das instruções e imagens do teste

### 3.1 Signup (instruções e imagens)

| Requisito | Atendido | Como |
|-----------|----------|------|
| Primeira tela é um **modal de signup** | Sim | Modal "Welcome to CodeLeap network!" é exibido na abertura quando não há usuário (sem sessão Google e sem username no contexto). |
| **Não criar usuários no backend** | Sim | Nenhuma chamada à API para registro; apenas armazenamento no frontend. |
| **Manter o username no frontend** | Sim | `UsernameContext` persiste em `localStorage` (chave `codeleap-username`). |
| **Enviar o username ao criar post** | Sim | `CreatePostForm` usa `useUsername()` e `createPost(username, title, content)` em `lib/api.ts`. |

### Instruções das imagens (Sign up)

- **"The first screen is a 'signup modal' type of screen"** → Modal na rota `/` quando não há `displayUsername`.
- **"Just keep the username string somewhere in the frontend so we can submit it when creating a post later on"** → localStorage + contexto; uso do username em todo fluxo de criação de post.

### Requisitos gerais (imagens)

- **CRUD simples** → Criar, listar, editar e deletar posts na tela main.
- **Integração com o servidor de teste** → `https://dev.codeleap.co.uk/careers/` em `lib/api.ts`.
- **React** → Next.js (React) + TypeScript.

---

## Sign out e proteção de acesso

- **Sign out encerra a sessão e volta para sign-in:**  
  No clique em "Sign out":
  1. `setUsername(null)` limpa o contexto e o `localStorage`.
  2. Se houver sessão Google: `signOut({ callbackUrl: "/" })` remove o cookie do NextAuth e redireciona para `/`.
  3. Se for apenas username: `window.location.href = "/"` recarrega em `/`.
- **Acesso somente após login:**  
  A tela main (feed, criar post) só é renderizada quando existe `displayUsername` (sessão Google ou username no contexto). Sem sessão e sem username, a página em `/` exibe apenas o modal de signup; alterar a URL para `/` não concede acesso à main sem ter feito signup/sign-in antes.
