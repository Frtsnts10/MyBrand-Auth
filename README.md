# MyBrand Auth

Sign-in flow and dashboard for MyBrand, built with Next.js 15 (App Router), HeroUI v2 and Tailwind CSS v4.

> **Note:** Authentication is currently **mocked**. A successful sign-in sets `mock_session=true` in `localStorage`; logging out removes it. There is no backend yet, so don't use this in production as-is.

## Features

- **Auth screens** (`/`): sign in, sign up, reset password and update password, with Zod validation and toast feedback.
- **Protected area** (`app/(protected)`): wrapped in `AuthGuard`, which redirects to `/` when there is no session.
- **Dashboard** (`/dashboard`): insight cards and charts (Recharts).
- **Placeholder pages**: a catch-all route shows a "We are Building!" page for sections that don't exist yet (POS, Products, Customers, and so on).
- **Light/dark theme**: toggled with `next-themes`; dark is the default.

## Tech stack

| Area       | Library                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------- |
| Framework  | [Next.js 15](https://nextjs.org/docs), [React 18](https://react.dev/)                    |
| UI         | [HeroUI v2](https://heroui.com/), [Tailwind CSS v4](https://tailwindcss.com/), [Tailwind Variants](https://tailwind-variants.org) |
| Animation  | [Framer Motion](https://www.framer.com/motion/)                                           |
| Charts     | [Recharts 3](https://recharts.org/)                                                       |
| Icons      | [Lucide](https://lucide.dev/)                                                             |
| Validation | [Zod 4](https://zod.dev/)                                                                 |
| Language   | [TypeScript 5](https://www.typescriptlang.org/)                                           |

## Getting started

Requirements: Node.js 18.18 or newer (Node 20+ recommended).

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>. The sign-in form is pre-filled with demo credentials.

### Scripts

| Command            | Description                               |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Start the dev server (Turbopack)          |
| `npm run build`    | Create a production build                 |
| `npm run start`    | Serve the production build                |
| `npm run lint`     | Run ESLint                                |
| `npm run lint:fix` | Run ESLint and apply automatic fixes      |
| `npm run format`   | Format the codebase with Prettier         |

### Using pnpm

If you use `pnpm`, add the following to `.npmrc` and run `pnpm install` again:

```bash
public-hoist-pattern[]=*@heroui/*
```

## Project structure

```
app/
  page.tsx              # Auth screens (sign in / sign up / reset)
  (protected)/          # Routes behind AuthGuard
    dashboard/          # Dashboard
    [...slug]/          # "Under construction" fallback
components/             # Navbar, sidebar, auth guard, theme switch, etc.
config/site.ts          # Site name, navigation, quick actions, insight cards
styles/                 # Global styles
```

Navigation, quick actions and dashboard insight cards are set in `config/site.ts`.

## License

MIT. See [LICENSE](./LICENSE). Based on the [HeroUI Next.js template](https://github.com/heroui-inc/next-app-template).
