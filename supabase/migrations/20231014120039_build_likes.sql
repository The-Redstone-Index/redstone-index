/*
 * Likes table
 */
create table build_likes(
    build_id serial references public.builds on delete cascade not null,
    user_id uuid references public.users on delete cascade not null,
    created_at timestamptz default now() not null,
    primary key (build_id, user_id)
);

alter table build_likes enable row level security;

create policy "Anyone can view build likes." on build_likes
    for select
        using (true);

create policy "Users can create build likes." on build_likes
    for insert to authenticated
        with check (auth.uid() = user_id);

create policy "Users can delete builds likes." on build_likes
    for delete to authenticated
        using (auth.uid() = user_id);

revoke update on table build_likes from anon;

revoke update on table build_likes from authenticated;


/*
 * Create readonly likes counter in builds table
 */
alter table builds
    add column likes_count integer default 0 not null;

create or replace function update_build_likes_count()
    returns trigger
    as $$
begin
    update
        builds
    set
        likes_count = case when TG_OP = 'INSERT' then
            likes_count + 1
        when TG_OP = 'DELETE' then
            likes_count - 1
        else
            likes_count
        end
    where
        id = COALESCE(new.build_id, old.build_id);
    return null;
end;
$$
language plpgsql
security definer;

create trigger update_build_likes_count_trigger
    after insert or delete on build_likes for each row
    execute function update_build_likes_count();


/*
 * Send notifications to user when build likes hit threshold.
 */
create or replace function notify_user_after_build_likes_threshold()
    returns trigger
    as $$
declare
    likes_count integer;
    already_sent boolean;
    author_id uuid;
    notification_message text;
    notification_link text := '/builds/' || new.build_id;
    notification_icon text := 'fas fa-thumbs-up';
begin
    -- Get number of likes
    select
        count(*) into likes_count
    from
        build_likes
    where
        build_id = new.build_id;
    -- Check threshold
    if likes_count not in (1, 5, 10, 20, 100) then
        return null;
    end if;
    -- Create Message
    notification_message := case likes_count
    when 1 then
        'Your build has 1 like!'
    else
        'Your build has ' || likes_count || ' likes!'
    end;
    -- Get build author ID
    select
        user_id into author_id
    from
        builds
    where
        id = new.build_id;
    -- Check if a notification was already sent
    select
        1 into already_sent
    from
        user_notifications
    where
        user_id = author_id
        and message = notification_message
        and link = notification_link;
    if already_sent then
        return null;
    end if;
    -- Send the build likes notification
    insert into user_notifications(user_id, message, icon, link)
        values (author_id, notification_message, notification_icon, notification_link);
    return null;
end;
$$
language plpgsql
security definer;

create trigger notify_user_after_build_likes_threshold_trigger
    after insert on build_likes for each row
    execute function notify_user_after_build_likes_threshold();
