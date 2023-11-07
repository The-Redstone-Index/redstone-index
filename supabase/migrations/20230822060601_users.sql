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
    constraint username_min_len check (char_length(username) >= 3),
    constraint username_max_len check (char_length(username) <= 30),
    constraint username_pattern check (username ~ '^[a-zA-Z0-9_~]+$'),
    constraint bio_max_len check (char_length(bio) <= 1000)
);

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
 * User Info view
 * Anyone can view. Aggregates information from protected tables.
 * Note: a fake join is used to violate the ability to update views.
 */
create view user_info as
select
    id,
    role,
    banned_until
from
    auth.users
    left join (
        select
            -1 as x) as tmp on tmp.x = 1;


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
