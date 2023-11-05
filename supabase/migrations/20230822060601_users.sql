/*
 * User Role Check functions
 */
create or replace function is_member()
    returns boolean
    as $$
begin
    return(
        select
            is_member_forced
            or member_until > now()
        from
            users_restricted
        where
            id = auth.uid());
end;
$$
language plpgsql;

create or replace function is_admin()
    returns boolean
    as $$
begin
    return(
        select
            is_admin
        from
            users_restricted
        where
            id = auth.uid());
end;
$$
language plpgsql;

create or replace function is_moderator()
    returns boolean
    as $$
begin
    return(
        select
            is_moderator
        from
            users_restricted
        where
            id = auth.uid());
end;
$$
language plpgsql;

create or replace function is_moderator_or_admin()
    returns boolean
    as $$
begin
    return(
        select
            is_moderator
            or is_admin
        from
            users_restricted
        where
            id = auth.uid());
end;
$$
language plpgsql;


/*
 * Ban User function
 */
create or replace function public.ban_user(user_id uuid, until_date timestamptz)
    returns text
    as $$
begin
    -- Check user role
    if not is_moderator_or_admin() then
        raise exception 'User should not have permission to ban users.';
    end if;
    -- Ban user
    update
        auth.users
    set
        banned_until = until_date
    where
        id = user_id;
end;
$$
security definer
language plpgsql;

create or replace function sync_banned_until()
    returns trigger
    as $$
begin
    update
        public.users_restricted
    set
        banned_until = new.banned_until
    where
        id = new.id;
    return NEW;
end;
$$
language plpgsql;

create trigger sync_banned_until_trigger
    after update on auth.users for each row
    execute function sync_banned_until();


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
    constraint username_length check (char_length(username) >= 3),
    constraint username_pattern check (username ~ '^[a-zA-Z0-9_]+$')
);

alter table users enable row level security;

create policy "Anyone can view user info." on users
    for select
        using (true);

create policy "Owner can edit their own user info." on users
    for update to authenticated
        using (auth.uid() = id
            or is_moderator_or_admin());

revoke update on table users from authenticated;

grant update (username, avatar_path, bio) on table users to authenticated;


/*
 * Users Private table
 * Only owner can view or edit.
 */
create table users_private(
    id uuid references public.users on delete cascade not null primary key,
    api_token text
);

alter table users_private enable row level security;

create policy "Owner can view their own private user data." on users_private
    for select to authenticated
        using (auth.uid() = id);

create policy "Owner can edit their own private user data." on users_private
    for update to authenticated
        using (auth.uid() = id);

revoke update on table users_private from authenticated;

grant update (api_token) on table users_private to authenticated;


/*
 * User Restricted table
 * Anyone can view. Only admin can edit.
 */
create table users_restricted(
    id uuid references public.users on delete cascade not null primary key,
    is_admin boolean not null default false,
    is_moderator boolean not null default false,
    member_until timestamptz default null,
    banned_until timestamptz default null
);

alter table users_restricted enable row level security;

create policy "Anyone can view user information." on users_restricted
    for select to authenticated
        using (auth.uid() = id);

create policy "Only admin can edit restricted user information." on users_restricted
    for update to authenticated
        using (is_admin());

revoke update on table users_restricted from authenticated;

grant update (is_moderator, member_until, banned_until) on table users_restricted to authenticated;


/*
 * Create profile on sign-up trigger
 */
create function public.handle_new_user()
    returns trigger
    as $$
begin
    insert into public.users(id, avatar_path, username)
        values(new.id, new.raw_user_meta_data ->> 'avatar_path', new.raw_user_meta_data ->> 'initial_username');
    insert into public.users_private(id)
        values(new.id);
    insert into public.users_restricted(id)
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
 * Avatars bucket
 */
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
    values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

create policy "Avatar images are publicly accessible." on storage.objects
    for select
        using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar into their own folder." on storage.objects
    for insert
        with check (bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Image owner can delete their own avatar." on storage.objects
    for delete
        using (bucket_id = 'avatars'
            and auth.uid() = owner);
