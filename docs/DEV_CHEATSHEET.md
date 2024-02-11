# DEV Cheatsheet

- [DEV Cheatsheet](#dev-cheatsheet)
  - [Terminal Commands](#terminal-commands)
    - [SvelteKit](#sveltekit)
    - [Supabase](#supabase)
  - [SQL](#sql)
    - [Make all users moderators](#make-all-users-moderators)
    - [Analyzing query performance with indexes](#analyzing-query-performance-with-indexes)
    - [Manually update the recent/trending builds view](#manually-update-the-recenttrending-builds-view)


## Terminal Commands

### SvelteKit

| Command         | Purpose                        |
| --------------- | ------------------------------ |
| `npm run dev`   | Run local development server   |
| `npm run build` | Build front-end for production |

Front-end is automatically built and deployed to CloudFlare pages after each commit.

### Supabase

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

## SQL

### Make all users moderators

For testing in the staging environment.

```sql
/*
 * Function
 */
create function public.staging_set_all_users_to_mod()
    returns trigger
    as $$
begin
    -- Update the role of the newly inserted user to 'moderator'
    update
        public.users
    set
        role = 'moderator'
    where
        id = new.id;
    return NEW;
end;
$$
language plpgsql
security definer;


/*
 * Create Trigger
 */
create trigger on_new_moderator_user
    after insert on public.users for each row
    execute procedure public.staging_set_all_users_to_mod();


/*
 * Remove Trigger
 */
drop trigger on_new_moderator_user on public.users;
```

### Analyzing query performance with indexes

Turn of sequential scans and explain queries.

```sql
SET enable_seqscan = off;

EXPLAIN SELECT * FROM users WHERE id = 'c7a11191-7ef9-43dc-8c21-a07aeadf13db';
-- EXPLAIN SELECT * FROM users WHERE numeric_id = 1;
-- EXPLAIN SELECT * FROM users WHERE username ILIKE '%super%' order by username;
```

### Manually update the recent/trending builds view

```sql
REFRESH MATERIALIZED VIEW trending_builds_view;
REFRESH MATERIALIZED VIEW recent_builds_view;
```
