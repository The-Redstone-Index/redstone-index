# Command Cheat-sheet

## SvelteKit

| Command         | Purpose                        |
| --------------- | ------------------------------ |
| `npm run dev`   | Run local development server   |
| `npm run build` | Build front-end for production |

Front-end is automatically built and deployed to CloudFlare pages after each commit.

## Supabase

| Command                                                    | Purpose                                            |
| ---------------------------------------------------------- | -------------------------------------------------- |
| Local Development:                                         |                                                    |
| `npx supabase start`                                       | Start Supabase containers                          |
| `npx supabase stop`                                        | Stop Supabase containers                           |
| `npx supabase db reset`                                    | Reset local database to local migration scripts    |
| Managing Local Migrations:                                 |                                                    |
| `npx supabase db diff -f <name> --schema <schema>`         | Pull local migrations to migration scripts folder  |
| `npx supabase db remote commit --schema <schema>`          | Pull remote migrations to migration scripts folder |
| `npx supabase migration new <name>`                        | Manually create a new migration script             |
| `npx supabase gen types typescript --local > types.gen.ts` | Generate TypeScript types file                     |
| `npx supabase migration list`                              | View migrations present on local and remote        |
| Managing Remote Database:                                  |                                                    |
| `npx supabase db push`                                     | Push migration scripts to remote                   |
| `npx supabase link --project-ref <project-id>`             | Link remote project                                |
