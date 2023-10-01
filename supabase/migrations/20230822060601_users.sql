/*
 * Users table
 * Only owners and moderators can view this table, and edit specific columns.
 */
create table users(
    id uuid references auth.users on delete cascade not null primary key,
    numeric_id serial not null,
    created_at timestamptz default now() not null,
    api_token text,
    bio text not null default '',
    avatar_path text,
    username text unique not null,
    constraint username_length check (char_length(username) >= 3),
    constraint username_pattern check (username ~ '^[a-zA-Z0-9_]+$')
);

alter table users enable row level security;

create policy "Owner can view their own user info." on users
    for select to authenticated
        using (auth.uid() = id);

create policy "Owner can edit their own user info." on users
    for update to authenticated
        using (auth.uid() = id);

create policy "Moderators can view user info." on users
    for select to moderator
        using (true);

create policy "Moderators can edit user info." on users
    for update to moderator
        using (true);

revoke update on table users from authenticated;

grant update (username, avatar_path, bio, api_token) on table users to authenticated;


/*
 * User Profiles view
 * Anyone can view.
 */
select
    u.id,
    u.numeric_id,
    u.created_at,
    u.bio,
    u.avatar_path,
    u.username,
    null as member_until,
    a.role,
    a.banned_until
from
    public.users u
    inner join auth.users a on u.id = a.id;


/*
 * Create profile on sign-up trigger
 */
create function public.handle_new_user()
    returns trigger
    as $$
begin
    insert into public.users(id, avatar_path, username)
        values(new.id, new.raw_user_meta_data ->> 'avatar_path', new.raw_user_meta_data ->> 'initial_username');
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
