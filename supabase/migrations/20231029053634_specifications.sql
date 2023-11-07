/*
 * Specifications table
 */
create table specifications(
    id serial primary key not null,
    name text unique not null,
    description text not null default '',
    unit text not null default '',
    keywords text not null default '',
    created_by uuid references public.users on delete set null,
    created_at timestamptz default now() not null,
    full_text_search tsvector generated always as (to_tsvector('english', name || ' ' || keywords || ' ' || description || ' ' || unit)) stored,
    constraint name_min_len check (char_length(name) >= 3),
    constraint name_max_len check (char_length(name) <= 80),
    constraint description_max_len check (char_length(description) <= 1000),
    constraint unit_max_len check (char_length(unit) <= 20),
    constraint keywords_max_len check (char_length(keywords) <= 200)
);

alter table specifications enable row level security;

create policy "Anyone can view specifications." on specifications
    for select
        using (true);

create policy "Moderators can edit specifications." on specifications
    for update to moderator
        using (true);

create policy "Moderators can create specifications." on specifications
    for insert to moderator
        with check (true);

-- TODO
create policy "Members can create specifications." on specifications
    for insert to authenticated
        with check (false);

create policy "Moderators can delete specifications." on specifications
    for delete to moderator
        using (true);

revoke update on table specifications from authenticated;

grant update (name, description, unit, keywords) on table specifications to moderator;


/*
 * Build Specifications table
 */
create table build_specifications(
    build_id serial references public.builds on delete cascade not null,
    specification_id serial references public.specifications on delete cascade not null,
    value numeric,
    primary key (build_id, specification_id)
);

alter table build_specifications enable row level security;

create policy "Build owner can add specifications to their own build." on build_specifications
    for insert to authenticated
        with check (auth.uid() =(
            select
                user_id
            from
                public.builds
            where
                id = build_specifications.build_id));

create policy "Build owner can delete specifications from their own build." on build_specifications
    for delete to authenticated
        using (auth.uid() =(
            select
                user_id
            from
                public.builds
            where
                id = build_specifications.build_id));

revoke update on table build_specifications from authenticated;


/*
 * Create readonly use counter in specifications table
 */
alter table specifications
    add column usage_count integer default 0 not null;

create or replace function update_specification_usage_count()
    returns trigger
    as $$
begin
    if TG_OP = 'INSERT' then
        -- Increment operation
        update
            specifications
        set
            usage_count = usage_count + 1
        where
            id = new.specification_id;
    elsif TG_OP = 'DELETE' then
        -- Decrement operation
        update
            specifications
        set
            usage_count = usage_count - 1
        where
            id = old.specification_id;
    end if;
    return null;
end;
$$
language plpgsql
security definer;

create trigger update_specifications_usage_count_trigger
    after insert or delete on build_specifications for each row
    execute function update_specification_usage_count();
