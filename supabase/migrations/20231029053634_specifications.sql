/*
 * Specifications table
 */
create table specifications(
    id serial primary key not null,
    name text unique not null,
    description text not null default '',
    unit text,
    keywords text not null default '',
    created_by uuid references public.users on delete set null,
    created_at timestamptz default now() not null,
    full_text_search tsvector generated always as (to_tsvector('english', name || ' ' || keywords || ' ' || description || ' ' || unit)) stored,
    constraint name_min_len check (char_length(name) >= 3),
    constraint name_max_len check (char_length(name) <= 80),
    constraint description_max_len check (char_length(description) <= 1000),
    constraint unit_max_len check (char_length(unit) <= 30),
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
 * Build Specifications table (read purpose only)
 */
create table build_specifications(
    build_id serial references public.builds on delete cascade not null,
    specification_id serial references public.specifications on delete cascade not null,
    value numeric,
    primary key (build_id, specification_id)
);

alter table build_specifications enable row level security;

create policy "Anyone can view build specifications." on build_specifications
    for select
        using (true);


/*
 * Create readonly use counter in specifications table
 */
alter table specifications
    add column usage_count integer default 0 not null;

create or replace function update_specification_usage_count()
    returns trigger
    as $$
begin
    update
        specifications
    set
        usage_count = case when TG_OP = 'INSERT' then
            usage_count + 1
        when TG_OP = 'DELETE' then
            usage_count - 1
        else
            usage_count
        end
    where
        id = COALESCE(new.specification_id, old.specification_id);
    return null;
end;
$$
language plpgsql
security definer;

create trigger update_specifications_usage_count_trigger
    after insert or delete on build_specifications for each row
    execute function update_specification_usage_count();


/*
 * Syncronise the build_specifications table based on builds.specifications
 */
create or replace function update_build_specifications()
    returns trigger
    as $$
begin
    -- Delete existing build_extra_schematics for the given build_id
    delete from build_specifications
    where build_id = new.id;
    -- Insert new build_extra_schematics based on the updated tags array
    insert into build_specifications(build_id, specification_id, value)
    select
        new.id,
(jsonb_each(new.specifications)).key::integer,
(jsonb_each(new.specifications)).value::numeric;
    return NEW;
end;
$$
security definer
language plpgsql;

create trigger sync_build_specifications_after_change
    after insert or update or delete on public.builds for each row
    execute function update_build_specifications();
