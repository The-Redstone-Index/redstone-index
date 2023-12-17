/*
 * Builds table
 * Anyone can view this table, only owner and mods edit specific columns.
 */
create table builds(
    id serial primary key not null references public.schematics,
    user_id uuid references public.users on delete cascade not null,
    works_in_version integer,
    breaks_in_version integer,
    tested_in_version integer,
    title text not null,
    description text not null default '',
    created_at timestamptz default now() not null,
    full_text_search tsvector generated always as (to_tsvector('english', title || ' ' || description)) stored,
    extra_images text[] not null default array[] ::text[],
    tags integer[] default '{}' ::integer[] not null,
    extra_schematics integer[] default '{}' ::integer[] not null,
    specifications jsonb default '{}' ::jsonb not null,
    size_dimensions integer[] check (array_length(size_dimensions, 1) = 3) not null,
    volume integer generated always as (size_dimensions[1] * size_dimensions[2] * size_dimensions[3]) stored,
    block_counts jsonb not null,
    constraint title_min_len check (char_length(title) >= 5),
    constraint title_max_len check (char_length(title) <= 80),
    constraint description_max_len check (char_length(description) <= 5000)
);

alter table builds enable row level security;

create policy "Builds are viewable by everyone." on builds
    for select
        using (true);

create policy "Users can create their own builds." on builds
    for insert to authenticated
        with check (auth.uid() = user_id
        and (auth.uid() =(
            select
                user_id
            from
                public.schematics
            where
                id = builds.id)));

create policy "Users can edit their own builds." on builds
    for update to authenticated
        using (auth.uid() = user_id);

create policy "Mods can edit all builds." on builds
    for update to moderator
        using (true);

revoke update on table builds from authenticated;

grant update (works_in_version, breaks_in_version, tested_in_version, title, description, extra_images, tags, extra_schematics) on table builds to authenticated;
