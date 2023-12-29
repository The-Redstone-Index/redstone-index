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
