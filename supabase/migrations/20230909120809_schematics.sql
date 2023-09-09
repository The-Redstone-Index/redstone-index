-- Schematics bucket (no mime type works for NBT)
insert into storage.buckets(id, name, public, file_size_limit)
    values ('schematics', 'schematics', true, 52428800);

create policy "Schematics are publicly accessible." on storage.objects
    for select
        using (bucket_id = 'schematics');

create policy "Anyone can upload an schematic." on storage.objects
    for insert
        with check (bucket_id = 'schematics');

-- Enforce upload rate on schematics
create or replace function public.check_upload_rate()
    returns trigger
    as $$
declare
    user_is_admin boolean;
    user_is_member boolean;
    upload_count integer;
begin
    -- Retrieve the values from the user_roles table
    select
        is_admin,
        is_member into user_is_admin,
        user_is_member
    from
        user_roles
    where
        id = auth.uid();
    -- Upload count in the last minute
    raise log 'User is admin: %, User is member: %', user_is_admin, user_is_member;
    if not user_is_admin and not user_is_member then
        select
            count(*) into upload_count
        from
            storage.objects
        where
            bucket_id = 'schematics'
            and owner = auth.uid()
            and created_at >= now() - interval '1 minute';
        raise log 'Upload count: %', upload_count;
        if upload_count > 2 then
            raise exception 'You can only upload 2 schematics per minute.';
        end if;
    end if;
    return NEW;
end;
$$
language plpgsql;

create trigger enforce_upload_rate
    before insert on storage.objects for each row
    when(NEW.bucket_id = 'schematics')
    execute function check_upload_rate();
