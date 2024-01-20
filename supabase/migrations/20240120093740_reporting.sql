/*
 * User Reports table
 */
create table user_reports(
    id serial primary key not null,
    reporter_user_id uuid references public.users not null,
    reported_user_id uuid references public.users not null,
    link text not null,
    topic text not null,
    reason text not null,
    dismissed boolean default false not null,
    created_at timestamptz default now() not null,
    constraint reason_min_len check (char_length(reason) >= 3),
    constraint reason_max_len check (char_length(reason) <= 1000)
);

alter table user_reports enable row level security;

create policy "Authenticated users can create reports." on user_reports
    for insert to authenticated
        with check (true);

create policy "Moderators can view reports." on user_reports
    for select to moderator
        using (true);

create policy "Moderators users can dismiss reports." on user_reports
    for update to moderator
        using (true);

revoke update on table user_reports from anon;

revoke update on table user_reports from authenticated;

grant update (dismissed) on table user_reports to moderator;
