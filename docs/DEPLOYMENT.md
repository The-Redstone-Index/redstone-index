# Deployment

The production/staging environment consists of a SvelteKit website hosted on Cloudflare pages,
with a hosted Supabase backend.

* Supabase (BaaS)
* Cloudflare (Pages, Website, Turnstile, Email Routing)
* Resend (SMTP Email)

Below are instructions on how to deploy the full website using cloud infrastructure.

- [Deployment](#deployment)
  - [Supabase](#supabase)
  - [Cloudflare Pages](#cloudflare-pages)
  - [Cloudflare Turnstile](#cloudflare-turnstile)
  - [Resend](#resend)
  - [Cloudflare Email Routing](#cloudflare-email-routing)

## Supabase

Get started by linking a Supabase project:
```bash
npx supabase link --project-ref <project-ref-id>
```

> The project reference ID can be found under `Supabase Dashboard > Project Settings > General`

Supabase Vault Secrets:
* SERVICE_ROLE_KEY = `<your-supabase-service-role-key>`
* PROJECT_URL = `<your-supabase-project-url>`

Check that these database extensions are working properly (they are activated via migrations):
* `http` (you currently you need to toggle off/on this extension in order to activate it in production)
* `pg_cron`

Push changes to remote Supabase instance:
```bash
npx supabase db push
```

> Consider using GitHub actions for CICD
> ([example](https://github.com/plasmatech8/supabase-sveltekit-template/tree/main/.github/workflows))
> or use the upcoming Supabase GitHub integration.

Under `Authentication > URL Configuration`, configure:
* Site URL: `https://redstoneindex.org` or `https://staging.redstoneindex.org`
* (Optional) Redirect URLs: `https://*.redstone-index-18l.pages.dev` to connect preview front-end to the staging environment

## Cloudflare Pages

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

## Cloudflare Turnstile

Cloudflare Turnstile is a captcha service used to protect authentication pages.

Add a site. Add domains:
* Localhost for local development: `localhost`
* The subdomain for the Cloudflare pages production and staging environments (e.g. `develop.redstone-index-etd.pages.dev`)
* The domain name of the production website (e.g. `redstoneindex.org`)

Go into Supabase dashboard > Project Settings > Authentication. Toggle "Enable Captcha protection".

Choose the provider "Turnstile by Cloudflare" and add the Captcha secret.

## Resend

Resend is a SMTP service used to send and receive emails from the application.

Add the domain to Resend. Configure the DNS records and verify.

Go into `Supabase dashboard > Project Settings > Authentication`. Toggle "Enable Custom SMTP".

Configure SMTP details in the Supabase dashboard.

Set an appropriate sender name and email for production and staging environments.

You also need to go to `Authentication > Rate Limits` and change the Rate limit for sending emails.

## Cloudflare Email Routing

Cloudflare Email routing is used to route support@redstoneindex.org to another hidden email address.

Go to `Websites > redstoneindex.org > Email > Email Routing`.

Add a record for an address to receive emails.

You may need to add MX records to your DNS configuration, and will be prompted by the interface.

You may need to toggle off/on the record in order to get it working properly.
