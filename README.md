# The Redstone Index

<div align="center"><img src="static/redstone_dust.webp" height="100" width="100" style="display: block; margin: 20px auto;" align="center"></div>

<div align="center"><span style="display: block; margin: 20px auto; width: 400px">A place to share Redstone builds.</span></div>

👉 [Visit The Redstone Index](https://redstoneindex.org)

## Description

The Redstone Index is a platform designed for Minecraft enthusiasts to share and
discover innovative Redstone builds. Whether you are a seasoned Redstone engineer or just starting,
our platform provides a space to showcase your creations, explore inspiring builds, and connect with
a community passionate about Redstone contraptions.

Join The Redstone Index today and be part of a vibrant community pushing the boundaries of Redstone
engineering!

## Local Development

Local development consists of a SvelteKit application with a locally hosted Supabase instance.

### Setup

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

### Environment Variables

Configure environment variables.

Copy [.env.example](.env.example) and edit `PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_KEY`
using the values from the Supabase CLI. Use `npx supabase status` to retrieve the anon and service
key.

You can leave other environment variables as they are.

> `PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` can be left as-is because it Captcha protection is not
> enabled in the locally hosted Supabase instance.

### Run Development Server

Run local development hot-reload server:
```bash
npm run dev
```

Open the local website: http://localhost:5173/

### Making Database Migrations

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

### Reset the Local Database

Reset the local Supabase instance:
```bash
npm run reset
```

This will:
* Restart the Supabase docker containers with the new migration scripts.
* Update the database type definitions (in `types.gen.ts`)

## Remote Deployment

The production/staging environment consists of a SvelteKit website hosted on Cloudflare pages,
with a hosted Supabase backend and Cloudflare Turnstile.

### Supabase

Get started by linking a Supabase project:
```bash
npx supabase link --project-ref <project-ref-id>
```

> The project reference ID can be found under `Supabase Dashboard > Project Settings > General`

Supabase Vault Secrets:
* None currently

> In future, may consider storing `PROJECT_URL` and `SERVICE_ROLE_KEY` to allow
> for storage bucket handling inside SQL.

Push changes to remote Supabase instance:
```bash
npx supabase db push
```

> Consider using GitHub actions for CICD
> ([example](https://github.com/plasmatech8/supabase-sveltekit-template/tree/main/.github/workflows))
> or use the upcoming Supabase GitHub integration.

### Cloudflare Pages

Cloudflare Pages is a service used to deploy the SvelteKit website to a global CDN.

Create a Pages site and connect it to GitHub repository.

Cloudflare Pages Environment Variables:
  * NODE_VERSION = `16`
  * PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY = `<your-turnstile-key>`
  * PUBLIC_ENVIRONMENT_NAME = `PRODUCTION` or `STAGING`
  * PUBLIC_SUPABASE_ANON_KEY = `<your-supabase-anon-key>`
  * SUPABASE_SERVICE_KEY = `<your-supabase-service-key>`
  * PUBLIC_SUPABASE_URL = `<your-supabase-url>`

Create a production environment for the `main` branch and a preview environment for all
non-production branches.

To deploy to the staging environment, make a commit to the `develop` branch.

To deploy to production, make a commit to the `main` branch.

* The back-end migrations are automatically pushed to Supabase via GitHub actions.
* The front-end is automatically deployed to CloudFlare pages.

### Cloudflare Turnstile

Cloudflare Turnstile is a captcha service used to protect authentication pages.

Add a site. Add domains:
* Localhost for local development: `localhost`
* The subdomain for the Cloudflare pages production and staging environments (e.g. `develop.redstone-index-etd.pages.dev`)
* The domain name of the production website (e.g. `redstoneindex.org`)

Go into Supabase dashboard > Project Settings > Authentication. Toggle "Enable Captcha protection".
Configure choose the provider "Turnstile by Cloudflare" and add the Captcha secret.

## License

TBD