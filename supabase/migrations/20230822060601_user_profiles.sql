-- Profiles table
create sequence username_seq;

create table profiles(
    id uuid references auth.users on delete cascade not null primary key,
    username text unique not null default ('user' || nextval('username_seq')),
    avatar_url text,
    api_token text,
    created_at timestamptz default now(),
    constraint username_length check (char_length(username) >= 3),
    constraint username_pattern check (username ~ '^[a-zA-Z0-9_]+$')
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for
select using (true);

create policy "Users can update own profile." on profiles for
update using (auth.uid() = id);

-- Create profile on sign-up
create function public.handle_new_user() returns trigger as $$ begin
insert into public.profiles (id, avatar_url, username)
values (
        new.id,
        new.raw_user_meta_data->>'avatar_url',
        new.raw_user_meta_data->>'initial_username'
    );
return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();

-- Avatars bucket
insert into storage.buckets(
        id,
        name,
        public,
        file_size_limit,
        allowed_mime_types
    )
values (
        'avatars',
        'avatars',
        true,
        5242880,
        ARRAY ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    );

create policy "Avatar images are publicly accessible." on storage.objects for
select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects for
insert with check (bucket_id = 'avatars');