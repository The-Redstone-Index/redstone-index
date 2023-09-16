-- Builds table
create table builds(
    id serial primary key not null references public.schematics,
    user_id uuid references public.users on delete cascade not null,
    works_in_version_int integer not null,
    breaks_in_version_int integer not null,
    title text not null,
    description text not null,
    created_at timestamptz default now() not null
);

alter table builds enable row level security;

create policy "Builds are viewable bt everyone." on builds
    for select
        using (true);

create policy "Users can create their own builds." on builds
    for insert to authenticated
        with check (auth.uid() = user_id);

create policy "Users can edit their own builds." on builds
    for update to authenticated
        using (auth.uid() = user_id);
