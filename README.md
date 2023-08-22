# redstone-index

<img src="static/redstone_dust.webp" height="100" width="100" style="display: block; margin: 20px auto;">

<span style="display: block; margin: 20px auto; width: 400px">A website used to publish and share Redstone builds.</span>

## Development

### Front-end (SvelteKit)

| Command         | Purpose                        |
| --------------- | ------------------------------ |
| `npm run dev`   | Start Supabase containers      |
| `npm run build` | Build front-end for production |

Front-end is automatically built and deployed to CloudFlare pages after each commit.

### Back-end (Supabase)

| Command                                                    | Purpose                                            |
| ---------------------------------------------------------- | -------------------------------------------------- |
| Local Development:                                         |                                                    |
| `npx supabase start`                                       | Start Supabase containers                          |
| `npx supabase stop`                                        | Stop Supabase containers                           |
| `npx supabase db reset`                                    | Reset local database to local migration scripts    |
| Managing Local Migrations:                                 |                                                    |
| `npx supabase db diff -f <name> --schema <schema>`         | Pull local migrations to migration scripts folder  |
| `npx supabase db remote commit --schema <schema>`          | Pull remote migrations to migration scripts folder |
| `npx supabase migration new`                               | Manually create a new migration script             |
| `npx supabase gen types typescript --local > types.gen.ts` | Generate TypeScript types file                     |
| `npx supabase migration list`                              | View migrations present on local and remote        |
| Managing Remote Database:                                  |                                                    |
| `npx supabase db push`                                     | Push migration scripts to remote                   |
| `npx supabase link --project-ref <project-id>`             | Link remote project                                |