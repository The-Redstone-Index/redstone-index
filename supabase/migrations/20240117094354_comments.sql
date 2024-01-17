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
    for delete to authenticated
        using (auth.uid() = user_id);

create policy "Moderators can delete comments." on comments
    for delete to moderator
        using (true);

revoke update on table comments from anon;

revoke update on table comments from authenticated;


/*
 * Comment Likes table
 */
create table comment_likes(
    comment_id serial references public.comments on delete cascade not null,
    user_id uuid references public.users on delete cascade not null,
    created_at timestamptz default now() not null,
    primary key (comment_id, user_id)
);

alter table comment_likes enable row level security;

create policy "Anyone can view comment likes." on comment_likes
    for select
        using (true);

create policy "Users can create comment likes." on comment_likes
    for insert to authenticated
        with check (auth.uid() = user_id);

create policy "Users can delete comment likes." on comment_likes
    for delete to authenticated
        using (auth.uid() = user_id);

revoke update on table comment_likes from anon;

revoke update on table comment_likes from authenticated;
