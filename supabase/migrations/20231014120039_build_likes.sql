/*
 * Likes table
 */
create table build_likes(
    build_id serial references public.builds on delete cascade not null,
    user_id uuid references public.users on delete cascade not null,
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

revoke update on table build_likes from authenticated;


/*
 * Create readonly likes counter in builds table
 */
alter table builds
    add column likes_count integer default 0 not null;


/*
 * Increment the likes_count in the builds table when a like is inserted
 */
create or replace function increment_likes_count()
    returns trigger
    as $$
begin
    update
        builds
    set
        likes_count = likes_count + 1
    where
        id = new.build_id;
    return NEW;
end;
$$
language plpgsql
security definer;

create trigger increment_likes_count_trigger
    after insert on build_likes for each row
    execute function increment_likes_count();


/*
 *  Decrement the likes_count in the builds table when a like is deleted
 */
create or replace function decrement_likes_count()
    returns trigger
    as $$
begin
    update
        builds
    set
        likes_count = likes_count - 1
    where
        id = old.build_id;
    return OLD;
end;
$$
language plpgsql
security definer;

create trigger decrement_likes_count_trigger
    after delete on build_likes for each row
    execute function decrement_likes_count();
