# Local Development

Local development consists of a SvelteKit application with a locally hosted Supabase instance.

* SvelteKit
* Supabase Local Instance
* Docker Compose

Below are instructions on how to setup local development and make changes to the database.

- [Local Development](#local-development)
  - [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Run Development Server](#run-development-server)
  - [Making Database Migrations](#making-database-migrations)
  - [Reset the Local Database](#reset-the-local-database)

## Setup

Clone the repository
```bash
git clone git@github.com:The-Redstone-Index/redstone-index.git
```

Install NPM dependencies
```bash
npm install
```

Also make sure that [Docker](https://www.docker.com/) is installed on your system.

Start local Supabase instance: (make sure Docker daemon is running)
```bash
npx supabase start
```

Open the Supabase dashboard: http://127.0.0.1:54323

> Note: The locally hosted database will be populated with fake generated data which is defined in
> [supabase/seed.sql](supabase/seed.sql).

## Environment Variables

Configure environment variables.

Copy [.env.example](.env.example) and edit `PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_KEY`
using the values from the Supabase CLI. Use `npx supabase status` to retrieve the anon and service
key.

You can leave other environment variables as they are.

> `PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` can be left as-is because it Captcha protection is not
> enabled in the locally hosted Supabase instance. It is bypassed.

## Run Development Server

Run local development hot-reload server:
```bash
npm run dev
```

Open the local website: http://localhost:5173/

## Making Database Migrations

To make a database migration, you must create a new file under `supabase/migrations/`.

For this project, it is recommended to write database migrations manually for optimal control
and readability.

Create a migration file:
```bash
npx supabase migration new <name>
```

Edit migration file manually. Carefully consider:
* Row Level Security (RLS) rules
* Grant Privileges for column-level security
* Indexes for performance enhancements
* Triggers for additional functionality or events

> For inspiration, you can edit the running local Supabase instance via the dashboard and view
> the SQL corresponding to your changes by running the command `npx supabase db --schema <schema>`,
> or by opening the table definitions in the Supabase dashboard.

## Reset the Local Database

Reset the local Supabase instance:
```bash
npm run reset
```

This will:
* Restart the Supabase docker containers with the new migration scripts.
* Update the database type definitions (in `types.gen.ts`)
