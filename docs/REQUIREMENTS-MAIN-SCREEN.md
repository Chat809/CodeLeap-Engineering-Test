# Main screen – requisitos e bonus points

## Requisitos obrigatórios (instruções e imagens do teste)

### Criar posts
| Requisito | Atendido | Onde |
|-----------|----------|------|
| Formulário título + conteúdo | Sim | `CreatePostForm`: Title, Content, Create |
| Validação (trim, zod) | Sim | `createSchema` zod + `trimmedTitle`/`trimmedContent` |
| UI reage ao estado de validação | Sim | Botão Create desabilitado quando vazio (`isDisabled`) |
| Sem bypass óbvio da validação | Sim | Submit usa `safeParse` e botão desabilitado |
| Envio com username armazenado | Sim | `createPost(username!, ...)` em `lib/api.ts` |
| Atualizar lista/UI após criar | Sim | `invalidateQueries(["posts"])` + toast "Post created" |

### Buscar e exibir posts
| Requisito | Atendido | Onde |
|-----------|----------|------|
| GET no backend de teste | Sim | `fetchPosts` em `lib/api.ts`, base `https://dev.codeleap.co.uk/careers/` |
| Barra final na URL (Django/CORS) | Sim | `API_BASE` com `/` no fim |
| Estrutura dos itens (id, username, created_datetime, title, content) | Sim | `types/post.ts` + uso em `PostCard` e API |
| React Query para dados | Sim | `useInfiniteQuery` e `useMutation` em PostList/CreateForm/Edit/Delete |
| Lista ordenada (mais recentes primeiro) | Sim | `PostList`: sort por `created_datetime` desc |
| Lista atualiza ao criar novo post | Sim | `invalidateQueries` após create |

### Lista de posts (cada item)
| Requisito | Atendido | Onde |
|-----------|----------|------|
| Username | Sim | `@post.username` em `PostCard` |
| Título | Sim | `post.title` em `PostCard` |
| Conteúdo | Sim | `post.content` em `PostCard` |
| Data de criação formatada | Sim | `formatDate(post.created_datetime)` (e.g. "25 minutes ago") |
| Paginação | Sim | `useInfiniteQuery` + botão "Load more" |

### Editar e deletar (apenas próprios itens)
| Requisito | Atendido | Onde |
|-----------|----------|------|
| Comparação por username | Sim | `isOwn = currentUsername !== null && post.username === currentUsername` em `PostCard` |
| Ícones editar/deletar só para dono | Sim | `{isOwn && (... IconButtons )}` em `PostCard` |
| Modal de confirmação ao deletar | Sim | `DeleteConfirmModal`: "Are you sure you want to delete this item?" |
| Delete remove no backend e na UI | Sim | `deletePost(id)` + `invalidateQueries` + `onDeleted()` |
| Modal de edição (título + conteúdo) | Sim | `EditPostModal`: Title, Content, Cancel, Save |
| Edição persiste no backend e na UI | Sim | `updatePost(id, title, content)` + `invalidateQueries` + `onUpdated()` |

### API (Server data structure)
| Requisito | Atendido | Onde |
|-----------|----------|------|
| POST /careers/ com { username, title, content } | Sim | `createPost` em `lib/api.ts` |
| GET /careers/ para lista | Sim | `fetchPosts` em `lib/api.ts` |
| PATCH /careers/{id}/ com { title, content } | Sim | `updatePost` em `lib/api.ts` |
| DELETE /careers/{id}/ | Sim | `deletePost` em `lib/api.ts` |
| Hooks (não classes) | Sim | Componentes funcionais com hooks |

### Responsividade e usabilidade
| Requisito | Atendido | Onde |
|-----------|----------|------|
| Usável em mobile/tablet/desktop | Sim | Chakra responsive: `px={{ base: 4, md: 6 }}`, etc. |
| Loading e feedback de erro | Sim | Spinner ao carregar, "Failed to load posts" + Retry, toasts em create/edit/delete |

---

## Bonus points (imagem)

| Bônus | Status |
|-------|--------|
| Third-party authentication | Sim – Google Sign-In (NextAuth) |
| Pagination or infinite scroll | Sim – "Load more" com `useInfiniteQuery` |
| Responsive on mobile | Sim – layout responsivo Chakra |
| Permanent login/logout | Sim – Sign out encerra sessão e volta ao sign-in |
| Pretty animations, transitions or hover | Parcial – hover em cards e botões (tema Chakra) |
| Likes, Comments, Mentions, Media, Sorting/filtering | Não implementados (opcionais) |

---

## Critérios de avaliação frontend (imagem)

- **Design:** Seguir o Figma (CodeLeap Network, “What’s on your mind?”, placeholders, botão Create desabilitado quando vazio).
- **Consistência:** Layout limpo, espaçamento e tema blue-purple.
- **Usabilidade:** Fluxo claro (criar, listar, editar, deletar só os próprios).
- **Código:** Simples, reutilizável, service layer em `lib/api.ts`, componentes separados.
- **Deploy:** Aplicação deve ser implantada (ver README).
