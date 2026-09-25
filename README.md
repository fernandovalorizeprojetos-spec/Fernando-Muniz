# Project Dashboard Platform

Initial React + Vite + TypeScript foundation for a multi-client, multi-project dashboard platform powered by Supabase.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase project URL and publishable/anon key.
3. Run `npm install`.
4. Apply `supabase/migrations/20260925000000_initial_schema.sql` in the Supabase SQL Editor or through the Supabase CLI.
5. Run `npm run dev`.

Never put a service-role key in the frontend or commit environment files.
