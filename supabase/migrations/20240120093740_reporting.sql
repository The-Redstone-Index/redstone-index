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
        with check (auth.uid() = reporter_user_id);

create policy "Moderators can view reports." on user_reports
    for select to moderator
        using (true);

create policy "Moderators users can dismiss reports." on user_reports
    for update to moderator
        using (true);

revoke update on table user_reports from anon;

revoke update on table user_reports from authenticated;

grant update (dismissed) on table user_reports to moderator;

revoke insert on table user_reports from anon;

revoke insert on table user_reports from authenticated;

grant insert (reporter_user_id, reported_user_id, link, topic, reason) on table user_reports to authenticated;


/*
 * Send weekly moderation notification to moderators and admins
 */
create extension if not exists "pg_cron";

create or replace function auth.send_moderation_notifications()
    returns VOID
    language plpgsql
    as $$
declare
    report_count integer;
begin
    -- Get the count of user reports
    select
        COUNT(*) into report_count
    from
        user_reports
    where
        dismissed = false
        and created_at >= current_date - interval '1 week';
    -- Insert notification if there are non-dismissed user reports
    if report_count > 0 then
        insert into user_notifications(user_id, message, icon, link)
        select
            id,
            'There are ' || report_count || ' new user report(s) for moderation.',
            'fa-solid fa-bullhorn',
            '/moderation'
        from
            auth.users
        where
            role = 'administrator'
            or role = 'moderator';
    end if;
end;
$$;

-- Schedule the function with pg_cron (At 12:00 on Friday)
select
    cron.schedule('weekly-moderation-notifications', '0 12 * * 5', 'SELECT auth.send_moderation_notifications()');
