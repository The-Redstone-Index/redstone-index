-- Users table (all can read, no write)
create table users(
    id uuid references auth.users on delete cascade not null primary key,
    numeric_id serial not null,
    is_member boolean default false not null,
    is_admin boolean default false not null,
    created_at timestamptz default now() not null
);

alter table users enable row level security;

create policy "Users are viewable by everyone." on users
    for select
        using (true);

-- User Profiles table (all can read, only auth user can write)
create table user_profiles(
    user_id uuid references public.users on delete cascade not null primary key,
    username text unique not null,
    avatar_url text,
    bio text not null default '',
    created_at timestamptz default now() not null,
    constraint username_length check (char_length(username) >= 3),
    constraint username_pattern check (username ~ '^[a-zA-Z0-9_]+$')
);

alter table user_profiles enable row level security;

create policy "Profiles are viewable by everyone." on user_profiles
    for select
        using (true);

create policy "Users can update own profile." on user_profiles
    for update
        using (auth.uid() = user_id);

-- User Settings table (only user can read or write)
create table user_settings(
    user_id uuid references public.users on delete cascade not null primary key,
    api_token text
);

alter table user_settings enable row level security;

create policy "Users can only view their own settings." on user_settings
    for select
        using (auth.uid() = user_id);

create policy "Users can update own settings." on user_settings
    for update
        using (auth.uid() = user_id);

-- Create profile on sign-up
create function public.handle_new_user()
    returns trigger
    as $$
begin
    insert into public.users(id)
        values(new.id);
    insert into public.user_profiles(user_id, avatar_url, username)
        values(new.id, new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'initial_username');
    insert into public.user_settings(user_id)
        values(new.id);
    return new;
end;
$$
language plpgsql
security definer;

create trigger on_auth_user_created
    after insert on auth.users for each row
    execute procedure public.handle_new_user();

-- Avatars bucket
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
    values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

create policy "Avatar images are publicly accessible." on storage.objects
    for select
        using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
    for insert
        with check (bucket_id = 'avatars');

create policy "Image owner can delete their own avatar." on storage.objects
    for delete
        using (bucket_id = 'avatars'
            and auth.uid() = owner);
