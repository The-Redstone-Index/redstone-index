/*
 * Schematics bucket
 * No mime type specified, because none work for NBT.
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
declare
    owner_id uuid;
begin
    if new.bucket_id = 'schematics' then
        owner_id :=(storage.foldername(new.name))[1]::uuid;
        insert into public.schematics(user_id, object_path)
            values (owner_id, new.name);
    end if;
    return new;
end;
$$
language plpgsql
security definer;

create trigger on_schematic_upload
    after insert on storage.objects for each row
    execute procedure public.handle_new_schematic();


/*
 * Enforce upload rate on schematics trigger
 */
create or replace function public.check_upload_rate()
    returns trigger
    as $$
declare
    is_member boolean;
    upload_count integer;
    user_role text;
begin
    -- Get role and membership status
    select
        role,
        member_until > current_timestamp into user_role,
        is_member
    from
        public.users
    where
        id = new.user_id;
    -- Admins and mods have no upload limit
    if (user_role = 'administrator' or user_role = 'moderator') then
        return NEW;
    end if;
    -- Members have no upload limit
    if (is_member) then
        return NEW;
    end if;
    -- Check upload count over the last minute
    select
        count(*) into upload_count
    from
        storage.objects
    where
        bucket_id = 'schematics'
        and (storage.foldername(name))[1]::uuid = new.user_id
        and created_at >= now() - interval '1 minute';
    raise log 'Upload count: %', upload_count;
    if upload_count > 2 then
        raise exception 'You can only upload 2 schematics per minute.';
    end if;
    -- Continue if rate not exceeded
    return NEW;
end;
$$
language plpgsql;

create trigger enforce_upload_rate
    before insert on public.schematics for each row
    execute function check_upload_rate();
