# CodeLeap Network

A simple CRUD web application built for the **CodeLeap Engineering Test**. Users can sign up with a username, create posts, view a feed, and edit or delete their own posts—integrated with the CodeLeap test API.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **React Query** (data fetching & cache)
- Additional libraries as needed (styling, forms, etc.)

## Features

- **Signup modal** — Capture username (stored in frontend only; no backend user creation).
- **Main screen** — Create posts, list posts (newest first), edit/delete only own posts (by username).
- **Delete confirmation** — Modal before deleting a post.
- **Edit modal** — Edit title and content of existing posts.

## API

- **Base URL:** `https://dev.codeleap.co.uk/careers/` (trailing slash required).
- **Endpoints:** GET (list), POST (create), PATCH (update), DELETE (delete).
- **Post payload (create):** `{ username, title, content }`.
- **Post payload (update):** `{ title, content }`.
- **Post shape (response):** `{ id, username, created_datetime, title, content }`.

## Design

UI follows the [CodeLeap Engineering Test Figma](https://www.figma.com/design/0OQWLQmU14SF2cDhHPJ2sx/CodeLeap-Engineering-Test?node-id=29005-137&t=h7rkxJDehHUdc6VC-0).

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The application is intended to be deployed (e.g. Vercel, Netlify) for assessment.

## License

Private — CodeLeap Engineering Test.
