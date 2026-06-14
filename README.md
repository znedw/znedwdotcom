# znedw.com

Personal website / blog for Zach Nedwich.

## Stack

- **Next.js 16** (App Router)
- **@next/mdx** for MDX support (no Nextra)
- **rehype-pretty-code** for syntax highlighting
- **next-themes** for dark/light mode
- **Pagefind** for site search (requires build)
- **Cusdis** for comments

## Local development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
# Pagefind index is generated automatically via postbuild
```

> [!NOTE]
> Search requires a production build. In dev mode the search input is disabled.

## Deployment

Deployed to [znedw.com](https://znedw.com) via Vercel. Push to `main` auto-deploys.
