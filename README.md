# redstone-index

<div align="center"><img src="static/redstone_dust.webp" height="100" width="100" style="display: block; margin: 20px auto;" align="center"></div>

<div align="center"><span style="display: block; margin: 20px auto; width: 400px">A website to publish and share Redstone builds.</span></div>

## Development

Get started with local development:
```bash
npm install
# Make sure Docker daemon is running
npx supabase start
npm run dev
```

Recommended way to make migrations:
```bash
npx supabase migration new <name>
# Edit migration file manually
# Use `npx supabase db --schema <schema>` to view changes
# ...or view definitions in the Supabase dashboard
npx supabase db reset
npx supabase gen types typescript --local > types.gen.ts
```

### Front-end (SvelteKit)

| Command         | Purpose                        |
| --------------- | ------------------------------ |
| `npm run dev`   | Run local development server   |
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
| `npx supabase migration new <name>`                        | Manually create a new migration script             |
| `npx supabase gen types typescript --local > types.gen.ts` | Generate TypeScript types file                     |
| `npx supabase migration list`                              | View migrations present on local and remote        |
| Managing Remote Database:                                  |                                                    |
| `npx supabase db push`                                     | Push migration scripts to remote                   |
| `npx supabase link --project-ref <project-id>`             | Link remote project                                |

### Required Manual Configuration

Vault/Secrets:
* PROJECT_URL (for storage bucket handling inside SQL)
* SERVICE_ROLE_KEY (for storage bucket handling inside SQL)