# CodeLeap Network

> Posts CRUD for the **CodeLeap Engineering Test** — React (Next.js), TypeScript, Chakra UI, CodeLeap API integration, username signup, edit/delete only for author, pagination, likes, comments and mentions.

---

## Live demo

The project is hosted on a subdomain of **Neomind Labs** (my software lab):

**https://codeleap-engineering-test.neomindlabs.net.br/**

---

## Tech stack

| Area | Technologies |
|------|----------------|
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript |
| **UI** | Chakra UI |
| **Data & API** | TanStack Query (React Query), fetch to CodeLeap API |
| **Forms & validation** | Zod |
| **Auth (optional)** | NextAuth (e.g. Google Sign-In) |

---

## Implemented features

The UI and flows follow the [CodeLeap Engineering Test Figma](https://www.figma.com/design/0OQWLQmU14SF2cDhHPJ2sx/CodeLeap-Engineering-Test?node-id=29005-137&t=h7rkxJDehHUdc6VC-0). Implemented scope:

### Core (required)

- **Signup** — Modal on first visit; username stored (localStorage); optional Google Sign-In (NextAuth).
- **Create post** — Title + content; validation with Zod and `trim()`; button disabled until valid; optional image (preview, remove); submit sends to API and refreshes list.
- **Fetch & list posts** — From CodeLeap API; shows username, title, content and formatted date; list updates after create/edit/delete.
- **Pagination** — Infinite list with “Load more” and `next` from API.
- **Edit post** — Modal to edit title and content; only for the logged-in user’s posts; persists via API.
- **Delete post** — Confirmation modal; only for own posts; removes from API and updates list.

### Bonus

- **Order by** — Newest first, Oldest first, Title A→Z, Title Z→A.
- **Likes** — Like/unlike posts; counter per post; persisted in localStorage.
- **Comments** — Add comments per post; list under each post; persisted in localStorage.
- **Replies** — Reply to comments; nested display; `parentId` in stored comments.
- **Comment likes** — Like/unlike per comment; counter; persisted in localStorage.
- **Mentions** — `@username` in post and comment content is highlighted in the UI.
- **Media** — Optional image per post (create/edit); preview and remove; stored in localStorage by post id.
- **Custom file input** — Styled like app headers (blue); shows selected file name; pointer cursor; no native gray sub-button.
- **Feedback** — Toasts on create/edit/delete and errors; loading states; list entry animation.

### UX & quality

- **Responsive layout** — Adapts to different viewport sizes.
- **Consistent styling** — Colors, typography and spacing aligned with the Figma design.

---

## API

- **Base URL:** `https://dev.codeleap.co.uk/careers/` (trailing slash required).
- **Endpoints:** GET (list, paginated), POST (create), PATCH (update), DELETE (delete).
- **Create payload:** `{ username, title, content }`.
- **Update payload:** `{ title, content }`.
- **Post shape:** `{ id, username, created_datetime, title, content }`.

Likes, comments, replies and media are **not** part of the test API; they are stored in the frontend (localStorage) for demo purposes.

---

## Design

UI follows the [CodeLeap Engineering Test Figma](https://www.figma.com/design/0OQWLQmU14SF2cDhHPJ2sx/CodeLeap-Engineering-Test?node-id=29005-137&t=h7rkxJDehHUdc6VC-0).

---

## Getting started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Signup is **username-only** by default: modal on first load, username in localStorage, used when creating posts.
- NextAuth (e.g. Google) is optional; copy `.env.example` to `.env.local` and set `NEXTAUTH_SECRET` (and Google credentials if using Google). For production, set `NEXTAUTH_URL` to your deployed URL (HTTPS).

---

## Environment

Use `.env.example` as reference. Copy it to `.env.local` for local development. In production (e.g. Hostinger), set variables in the host panel.

- **NEXTAUTH_URL** — In production, set to the app URL (HTTPS), e.g. `https://codeleap-engineering-test.neomindlabs.net.br`.
- **NEXTAUTH_SECRET** — Required; use a strong random value (e.g. `openssl rand -base64 32`). Do not commit real values.
- **GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET** — Only if using Google Sign-In.

---

## Deployment

The app is deployed at **https://codeleap-engineering-test.neomindlabs.net.br/** (Hostinger, subdomain of Neomind Labs). It can also be deployed to Vercel, Netlify or similar by connecting the repo and setting the environment variables above.

---

## License

Private — CodeLeap Engineering Test.

---

---

# About the author

**Khalil Salomão** — Full Stack Developer & Web Designer

I currently work as a Fullstack Developer and Web Designer, including as a freelancer, and I have a full scholarship in the Software Engineering course at UNDB. Below are my résumé, main links and some public projects, developed with the same kind of technologies you use.

---

## Links

| | Link |
|---|------|
| 📄 **Résumé** | [Google Drive](https://drive.google.com/file/d/1UWdHW2R5pOF2mk98nTbdBdvYw3T1qJtO/view?usp=sharing) |
| 💼 **LinkedIn** | [Profile](https://www.linkedin.com/in/khalil-salom%C3%A3o-955b81238/) — work and experience |
| 🌐 **Portfolio** | [portfolio.neomindlabs.net.br](https://portfolio.neomindlabs.net.br/) *(under development)* |
| 🐙 **GitHub** | [github.com/Chat809](https://github.com/Chat809) |
| 🎬 **Overview video** | [Loom (English)](https://www.loom.com/share/8fccd040f5c84920a97c83fc0b01026e) |

---

## Public applications in production

| Application | Description |
|--------------|-------------|
| [womantrip-loja.com](https://womantrip-loja.com/) | Agency e-commerce |
| [artemis.tur.br](https://artemis.tur.br/) | Full ERP (private access) |
| [tudoprontoproducoes.com.br](https://tudoprontoproducoes.com.br/) | Institutional website (ticket sales) |
| [magestao.inaed.com](https://magestao.inaed.com/) | Educational platform |
| inaed.com | Institutional |
| inaed.com/lp/pggns | Landing page |
| inaed.com/lp/pdd | Landing page |
| inaed.com/lp/gecom | Landing page |

---

## Main solutions I develop

- Landing pages  
- E-commerce  
- ERPs  
- Custom and automated emails  
- Process automation  
- Automated vacancy and inventory control  
- Integrations with external tools via API  
- Hosting and infrastructure management, GitHub versioning  
- Lead capture via forms and pop-ups with automations  
- Documented internal IT management structure  

---

## A short note

I still have a lot to learn. Feedback and guidance are welcome, and I don’t expect anyone to teach me step by step. I’m not attached to any specific technology; they are a means, not an end, and the real focus is on generating indicators and results. Moreover, it’s easier to train a team on a given technology than to change behavior, especially in the current generation, where responsibility and autonomy are often avoided due to a tendency to invert values.

I’m eager to contribute and learn. I hope we can do that together, with fair pay for fair work in line with the market.  
That’s what you can expect from me. And from my side—what could I expect from you?

Looking forward to your reply.
