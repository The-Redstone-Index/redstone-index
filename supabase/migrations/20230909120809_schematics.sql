/*
 * Schematics bucket
 * No mime type specificied, because none work for NBT.
 */
insert into storage.buckets(id, name, public, file_size_limit)
    values ('schematics', 'schematics', true, 52428800);

create policy "Schematics are publicly accessible." on storage.objects
    for select
        using (bucket_id = 'schematics');

create policy "Users can upload an schematic to their own folder." on storage.objects
    for insert to authenticated
        with check (bucket_id = 'schematics'
        and (storage.foldername(name))[1] = auth.uid()::text);


/*
 * Enforce upload rate on schematics trigger
 */
create or replace function public.check_upload_rate()
    returns trigger
    as $$
declare
    is_administrator boolean;
    is_moderator boolean;
    is_member boolean;
    upload_count integer;
begin
    -- Admins and mods have no upload limit
    is_administrator :=(auth.role() = 'administrator');
    is_moderator :=(auth.role() = 'moderator');
    if (is_administrator or is_moderator) then
        return NEW;
    end if;
    -- Members have no upload limit
    is_member := false;
    if (is_member) then
        return NEW;
    end if;
    -- Check upload count in the last minute
    select
        count(*) into upload_count
    from
        storage.objects
    where
        bucket_id = 'schematics'
        and owner = auth.uid()
        and created_at >= now() - interval '1 minute';
    raise log 'Upload count: %', upload_count;
    if upload_count >= 2 then
        raise exception 'You can only upload 2 schematics per minute.';
    end if;
    return NEW;
end;
$$
language plpgsql;

create trigger enforce_upload_rate
    before insert on storage.objects for each row
    when(NEW.bucket_id = 'schematics')
    execute function check_upload_rate();


/*
 * Schematics table
 */
create table schematics(
    id serial primary key not null,
    user_id uuid references public.users on delete cascade not null,
    object_path text not null,
    created_at timestamptz default now() not null
);

alter table schematics enable row level security;

create policy "Schematics are viewable bt everyone." on schematics
    for select
        using (true);


/*
 *  Create schematic record after upload trigger
 */
create function public.handle_new_schematic()
    returns trigger
    as $$
begin
    if new.bucket_id = 'schematics' then
        insert into public.schematics(user_id, object_path)
            values(new.owner, new.name);
    end if;
    return new;
end;
$$
language plpgsql
security definer;

create trigger on_schematic_upload
    after insert on storage.objects for each row
    execute procedure public.handle_new_schematic();
