/*
 * Tags table
 */
create table tags(
    id serial primary key not null,
    name text unique not null,
    description text not null default '',
    keywords text not null default '',
    created_by uuid references public.users on delete set null,
    created_at timestamptz default now() not null,
    full_text_search tsvector generated always as (to_tsvector('english', name || ' ' || keywords || ' ' || description)) stored,
    parent_id integer references public.tags on delete set null default null,
    recommended boolean not null default false,
    constraint name_min_len check (char_length(name) >= 3),
    constraint name_max_len check (char_length(name) <= 80),
    constraint description_max_len check (char_length(description) <= 1000),
    constraint keywords_max_len check (char_length(keywords) <= 200)
);

-- RLS
alter table tags enable row level security;

create policy "Anyone can view tags." on tags
    for select
        using (true);

create policy "Moderators can edit tags." on tags
    for update to moderator
        using (true);

create policy "Moderators can create tags." on tags
    for insert to moderator
        with check (auth.uid() = created_by);

create policy "Members can create tags." on tags
    for insert to authenticated
        with check (auth.uid() = created_by
        and auth.is_member());

create policy "Moderators can delete tags." on tags
    for delete to moderator
        using (true);

-- PRIVILEGES
revoke update on table tags from anon;

revoke update on table tags from authenticated;

grant update (name, description, keywords, created_by, parent_id, recommended) on table tags to moderator;

revoke insert on table tags from anon;

revoke insert on table tags from authenticated;

grant insert (name, description, keywords, created_by, parent_id) on table tags to authenticated;

-- INDEXES
create index idx_tags_full_text_search on tags using gin(full_text_search);

create index idx_tags_created_by on tags(created_by);

create index idx_tags_recommended on tags(recommended);


/*
 * Build Tags table (read purpose only)
 */
create table build_tags(
    build_id serial references public.builds on delete cascade not null,
    tag_id serial references public.tags on delete cascade not null,
    primary key (build_id, tag_id)
);

-- RLS
alter table build_tags enable row level security;

create policy "Anyone can view build tags." on build_tags
    for select
        using (true);


/*
 * Create readonly use counter in tag table
 */
alter table tags
    add column usage_count integer default 0 not null;

-- INDEXES
create index idx_tags_usage_count on tags(usage_count);

-- UPDATER
create or replace function update_tag_usage_count()
    returns trigger
    as $$
begin
    update
        tags
    set
        usage_count = case when TG_OP = 'INSERT' then
            usage_count + 1
        when TG_OP = 'DELETE' then
            usage_count - 1
        else
            usage_count
        end
    where
        id = COALESCE(new.tag_id, old.tag_id);
    return null;
end;
$$
language plpgsql
security definer;

create trigger update_tag_usage_count_trigger
    after insert or delete on build_tags for each row
    execute function update_tag_usage_count();


/*
 * Synchronize the build_tags table based on builds.tags
 */
create or replace function sync_build_tags_after_column_change()
    returns trigger
    as $$
begin
    -- Delete existing build_tags for the given build_id
    delete from build_tags
    where build_id = new.id;
    -- Insert new build_tags based on the updated tags array
    insert into build_tags(build_id, tag_id)
    select
        new.id,
        unnest(new.tags);
    return NEW;
end;
$$
security definer
language plpgsql;

create trigger sync_build_tags_after_column_change_trigger
    after insert or update or delete on public.builds for each row
    execute function sync_build_tags_after_column_change();


/*
 * Pre-existing build-type tags.
 * (SHOULD BE SET TO ID 1,2,3)
 */
insert into public.tags(name, description, keywords, recommended)
    values ('Circuit', 'A foundational element employed to manipulate a redstone signal, process inputs, or execute fundamental actions. Examples include monostable circuits, memory cells, and T flip-flops.', 'circuit cell unit', true);

insert into public.tags(name, description, keywords, recommended)
    values ('Module', 'A self-contained unit designed to activate and contribute a specific function within a larger construction.', 'module part unit', true);

insert into public.tags(name, description, keywords, recommended)
    values ('Contraption', 'A comprehensive, user-facing redstone creation, encompassing a range of functionalities for practical use. Examples include automated farms, intricate doors, and advanced storage systems.', 'contraption build', true);
