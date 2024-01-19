/*
 * Tags table
 */
create table comments(
    id serial primary key not null,
    user_id uuid references public.users not null,
    build_id integer references public.builds on delete cascade not null,
    replying_to integer references public.comments,
    content text not null,
    created_at timestamptz default now() not null,
    deleted boolean default false not null,
    constraint content_min_len check (char_length(content) >= 1),
    constraint content_max_len check (char_length(content) <= 1000)
);

alter table comments enable row level security;

create policy "Anyone can view comments." on comments
    for select
        using (true);

create policy "Authenticated users can create comments." on comments
    for insert to authenticated
        with check (auth.uid() = user_id);

create policy "Authenticated users can delete their own comments." on comments
    for update to authenticated
        using (auth.uid() = user_id);

create policy "Moderators can delete comments." on comments
    for update to moderator
        using (true);

revoke update on table comments from anon;

revoke update on table comments from authenticated;

grant update (deleted) on table comments to authenticated;


/*
 * Create readonly comment counter in builds table
 */
alter table builds
    add column comments_count integer default 0 not null;

create or replace function update_build_comments_count()
    returns trigger
    as $$
begin
    update
        builds
    set
        comments_count = case when TG_OP = 'INSERT' then
            comments_count + 1
        when TG_OP = 'DELETE' then
            comments_count - 1
        else
            comments_count
        end
    where
        id = COALESCE(new.build_id, old.build_id);
    return null;
end;
$$
language plpgsql
security definer;

create trigger update_build_comments_count_trigger
    after insert or delete on comments for each row
    execute function update_build_comments_count();


/*
 * Comment notifications
 */
create or replace function notify_users_after_comment()
    returns trigger
    as $$
declare
    replying_to_user_id uuid;
    commenter_username text;
    build_author_id uuid;
begin
    -- Fetch the user_id associated with the build_id author
    select
        user_id into build_author_id
    from
        builds
    where
        id = new.build_id;
    -- Do not send notification if author is same as the commenter
    if new.user_id = build_author_id then
        return null;
    end if;
    -- Fetch the username of the user who made the comment
    select
        username into commenter_username
    from
        users
    where
        id = new.user_id;
    -- Fetch the user_id associated with the replying_to comment
    select
        user_id into replying_to_user_id
    from
        comments
    where
        id = new.replying_to;
    -- Notify the user who created the build (if user isn't same user)
    insert into user_notifications(user_id, message, icon, link)
        values (build_author_id, concat(commenter_username, ' commented on your build!'), 'fas fa-comment', concat('/builds/', new.build_id, '?comment=', new.id));
    -- Notify the user being replied to
    if replying_to_user_id is not null then
        insert into user_notifications(user_id, message, icon, link)
            values (replying_to_user_id, concat(commenter_username, ' replied to your comment!'), 'fas fa-reply', concat('/builds/', new.build_id, '?comment=', new.id));
    end if;
    return null;
end;
$$
language plpgsql
security definer;

create trigger notify_users_after_comment_trigger
    after insert on comments for each row
    execute function notify_users_after_comment();
