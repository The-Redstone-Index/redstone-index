# The Redstone Index

<div align="center"><img src="static/redstone_dust.webp" height="100" width="100" style="display: block; margin: 20px auto;" align="center"></div>

<div align="center"><span style="display: block; margin: 20px auto; width: 400px">A place to share Redstone builds.</span></div>

👉 [Visit The Redstone Index](https://redstoneindex.org)

👉 [Staging Environment](https://staging.redstoneindex.org/)

## Description

The Redstone Index is a platform designed for Minecraft enthusiasts to share and
discover innovative Redstone builds. Whether you are a seasoned Redstone engineer or just starting,
our platform provides a space to showcase your creations, explore inspiring builds, and connect with
a community passionate about Redstone contraptions.

Join The Redstone Index today and be part of a vibrant community pushing the boundaries of Redstone
engineering!

## Local Development

Local development consists of a SvelteKit application with a locally hosted Supabase instance.

* SvelteKit
* Supabase Local Instance
* Docker Compose

For instructions on how to setup local development, visit [LOCAL_DEV](docs/LOCAL_DEV.md).

## Remote Deployment

The production/staging environment consists of a SvelteKit website hosted on Cloudflare pages,
with a hosted Supabase backend.

* Supabase (BaaS)
* Cloudflare (Pages, Website, Turnstile, Email Routing)
* Resend (SMTP Email)

For instructions on deployment, visit [DEPLOYMENT](docs/DEPLOYMENT.md).

## Possible Improvements

* Allow upload schematics via Litematic file
* Allow upload schematics via World file (with coordinates)
* Allow download schematic as Litematic file
* Allow download schematic as World file containing schematic
* Comment likes
* Contact page / social media links
* Improve API docs
* Donations page

## License

This project is currently licensed under the terms of the GNU AGPL (Affero General Public License). This license is designed to ensure that any modifications made to the project source code are open-sourced.

For more details, please review the [LICENSE](./LICENSE) file.