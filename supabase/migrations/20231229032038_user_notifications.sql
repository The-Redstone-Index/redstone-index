/*
 * User Notifications table
 * Only owner can view or edit.
 */
create table user_notifications(
    id serial primary key,
    user_id uuid references public.users on delete cascade not null,
    message text not null,
    icon text,
    link text,
    created_at timestamptz default now() not null
);

-- RLS
alter table user_notifications enable row level security;

create policy "Owner can view their own notifications." on user_notifications
    for select to authenticated
        using (auth.uid() = user_id);

create policy "Owner can delete their own notifications." on user_notifications
    for delete to authenticated
        using (auth.uid() = user_id);

-- INDEXES
create index idx_user_notifications_user_id on user_notifications(user_id, created_at);
