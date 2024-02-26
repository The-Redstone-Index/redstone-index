/*
 * Users table
 * Anyone can view. Owner and moderators can edit specific columns in the table.
 */
create table users(
    id uuid references auth.users on delete cascade not null primary key,
    numeric_id serial not null,
    created_at timestamptz default now() not null,
    bio text not null default '',
    avatar_path text,
    username text unique not null,
    role TEXT check (role in ('authenticated', 'moderator', 'administrator')) not null default 'authenticated',
    banned_until timestamp with time zone null,
    member_until timestamp with time zone null,
    constraint username_min_len check (char_length(username) >= 3),
    constraint username_max_len check (char_length(username) <= 30),
    constraint username_pattern check (username ~ '^[a-zA-Z0-9_~]+$'),
    constraint bio_max_len check (char_length(bio) <= 1000)
);

-- RLS
alter table users enable row level security;

create policy "Anyone can view user info." on users
    for select
        using (true);

create policy "Owner can edit their own user info." on users
    for update to authenticated
        using (auth.uid() = id);

create policy "Moderators can edit user info." on users
    for update to moderator
        using (true);

-- PRIVILEGES
revoke update on table users from anon;

revoke update on table users from authenticated;

grant update (username, avatar_path, bio) on table users to authenticated;

grant update (banned_until, member_until) on table users to moderator;

grant update (role) on table users to administrator;

-- INDEXES
create index idx_users_numeric_id on users(numeric_id);

create index idx_users_username on users(username);

create index idx_users_role on users(role);


/*
 * Trigger to update auth.users.role when public.users.role is changed.
 * (administrator only)
 */
create or replace function sync_user_role_after_column_change()
    returns trigger
    as $$
begin
    -- Prevent setting role to "administrator" (if you are a user and not dashboard user -> role() is null)
    if auth.role() is not null and new.role = 'administrator' then
        raise exception 'Cannot set role to administrator';
    end if;
    -- Prevent demoting an administrator
    if auth.role() is not null and old.role = 'administrator' then
        raise exception 'Cannot demote an administrator';
    end if;
    -- Update auth.users table
    update
        auth.users
    set
        role = new.role
    where
        id = new.id;
    return NEW;
end;
$$
security definer
language plpgsql;

create trigger sync_user_role_after_column_change_trigger
    after update of role on public.users for each row
    execute function sync_user_role_after_column_change();


/*
 * Trigger to update auth.users.banned_until when public.users.banned_until is changed.
 * (moderators and administrators only)
 */
create or replace function sync_user_banned_until_after_column_change()
    returns trigger
    as $$
begin
    -- Prevent banning an administrator
    if auth.role() is not null and old.role = 'administrator' then
        raise exception 'Cannot ban an administrator';
    end if;
    -- Update auth.users table
    update
        auth.users
    set
        banned_until = new.banned_until
    where
        id = new.id;
    return NEW;
end;
$$
security definer
language plpgsql;

create trigger sync_user_banned_until_after_column_change_trigger
    after update of banned_until on public.users for each row
    execute function sync_user_banned_until_after_column_change();


/*
 * Users Private table
 * Only owner can view or edit.
 */
create table users_private(
    id uuid references public.users on delete cascade not null primary key,
    api_token text
);

-- RLS
alter table users_private enable row level security;

create policy "Owner can view their own private user data." on users_private
    for select to authenticated
        using (auth.uid() = id);

create policy "Owner can edit their own private user data." on users_private
    for update to authenticated
        using (auth.uid() = id);

revoke update on table users_private from authenticated;

-- PRIVILEGES
grant update (api_token) on table users_private to authenticated;


/*
 * Create profile on sign-up trigger
 */
create function public.handle_new_user()
    returns trigger
    as $$
begin
    insert into public.users(id, avatar_path, username, role)
        values(new.id, new.raw_user_meta_data ->> 'avatar_path', new.raw_user_meta_data ->> 'initial_username', COALESCE(NULLIF(new.role, ''), 'authenticated'));
    insert into public.users_private(id)
        values(new.id);
    return new;
end;
$$
language plpgsql
security definer;

create trigger on_auth_user_created
    after insert on auth.users for each row
    execute procedure public.handle_new_user();


/*
 * Is user a member?
 */
create or replace function auth.is_member()
    returns boolean
    as $$
declare
    is_member boolean;
begin
    select
        member_until > current_timestamp into is_member
    from
        public.users
    where
        id = auth.uid();
    return is_member;
end;
$$
language plpgsql;
