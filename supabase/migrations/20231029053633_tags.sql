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
    constraint name_min_len check (char_length(name) >= 3),
    constraint name_max_len check (char_length(name) <= 80),
    constraint description_max_len check (char_length(description) <= 1000),
    constraint keywords_max_len check (char_length(keywords) <= 200)
);

alter table tags enable row level security;

create policy "Anyone can view tags." on tags
    for select
        using (true);

create policy "Moderators can edit tags." on tags
    for update to moderator
        using (true);

create policy "Moderators can create tags." on tags
    for insert to moderator
        with check (true);

-- TODO
create policy "Members can create tags." on tags
    for insert to authenticated
        with check (false);

create policy "Moderators can delete tags." on tags
    for delete to moderator
        using (true);

revoke update on table tags from authenticated;

grant update (name, description, keywords, parent_id) on table tags to moderator;


/*
 * Build Tags table
 */
create table build_tags(
    build_id serial references public.builds on delete cascade not null,
    tag_id serial references public.tags on delete cascade not null,
    primary key (build_id, tag_id)
);

alter table build_tags enable row level security;

create policy "Anyone can view build tags." on build_tags
    for select
        using (true);

create policy "Build owner can add tags to their own build." on build_tags
    for insert to authenticated
        with check (auth.uid() =(
            select
                user_id
            from
                public.builds
            where
                id = build_tags.build_id));

create policy "Build owner can delete tags from their own build." on build_tags
    for delete to authenticated
        using (auth.uid() =(
            select
                user_id
            from
                public.builds
            where
                id = build_tags.build_id));

revoke update on table build_tags from authenticated;


/*
 * Create readonly use counter in tag table
 */
alter table tags
    add column usage_count integer default 0 not null;

create or replace function update_tag_usage_count()
    returns trigger
    as $$
begin
    if TG_OP = 'INSERT' then
        -- Increment operation
        update
            tags
        set
            usage_count = usage_count + 1
        where
            id = new.tag_id;
    elsif TG_OP = 'DELETE' then
        -- Decrement operation
        update
            tags
        set
            usage_count = usage_count - 1
        where
            id = old.tag_id;
    end if;
    return null;
end;
$$
language plpgsql
security definer;

create trigger update_tag_usage_count_trigger
    after insert or delete on build_tags for each row
    execute function update_tag_usage_count();
