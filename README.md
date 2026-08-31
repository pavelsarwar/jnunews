# JnU News

Bangla-first, mobile-first dynamic online news portal for **jnunews.com**.

## v1
- Modern Bangla news homepage
- Responsive / news-app-inspired layout
- Breaking, lead, latest and category sections
- Article detail route
- Admin dashboard shell at `/admin`
- Dynamic category/article database schema for Supabase
- SEO-ready Next.js App Router foundation

## Run locally
```bash
npm install
npm run dev
```

## Database
Create a Supabase project, run `supabase/schema.sql`, then copy `.env.example` to `.env.local` and add credentials.

## Deployment
Recommended: connect this GitHub repo to Vercel, then add `jnunews.com` as a custom domain.
