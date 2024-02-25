-- Enable HTTP extension for sending requests to storage API
create extension "http" with schema extensions;


/*
 * Delete storage object function.
 */
create or replace function utils.delete_storage_object(bucket text, object text, OUT status int, OUT content text)
    returns record
    language 'plpgsql'
    security definer
    as $$
declare
    project_url text :=(
        select
            decrypted_secret
        from
            vault.decrypted_secrets
        where
            name = 'PROJECT_URL')::text;
    service_role_key text :=(
        select
            decrypted_secret
        from
            vault.decrypted_secrets
        where
            name = 'SERVICE_ROLE_KEY')::text;
    --  full access needed
    url text := project_url || '/storage/v1/object/' || bucket || '/' || object;
begin
    select
        into status,
        content result.status::int,
        result.content::text
    from
        extensions.http(('DELETE', url, array[extensions.http_header('authorization', 'Bearer ' || service_role_key)], null, null)::extensions.http_request) as result;
end;
$$;


/*
 * Delete avatar trigger
 */
create or replace function utils.delete_avatar(avatar_path text)
    returns void
    language 'plpgsql'
    security definer
    as $$
declare
    status int;
    content text;
begin
    select
        into status,
        content
    from
        utils.delete_storage_object('avatars', avatar_path) as result;
    if status <> 200 then
        raise warning 'Could not delete avatar: % %', status, content;
    end if;
end;
$$;

create or replace function delete_old_avatars()
    returns trigger
    language 'plpgsql'
    security definer
    as $$
declare
    status int;
    content text;
    object_name text;
begin
    -- Loop through and delete all unused avatar images
    for object_name in (
        select
            name
        from
            storage.objects
        where (bucket_id = 'avatars'
            and (storage.foldername(name))[1] = auth.uid()::text
            and (name <> new.avatar_path)))
    loop
        perform
            utils.delete_avatar(object_name);
    end loop;
    -- Finish trigger
    if tg_op = 'DELETE' then
        return old;
    end if;
    return new;
end;
$$;

create trigger delete_old_avatars_trigger
    before update of avatar_path or delete on public.users for each row
    execute function public.delete_old_avatars();


/*
 * Delete build extra images trigger
 */
-- create or replace function delete_old_build_extra_images()
--     returns trigger
--     language 'plpgsql'
--     security definer
--     as $$
-- declare
--     status int;
--     content text;
-- begin
--     if coalesce(old.avatar_path, '') <> '' and (tg_op = 'DELETE' or (old.avatar_path <> coalesce(new.avatar_path, ''))) then
--         select
--             into status, content result.status, result.content from public.delete_storage_object('avatars', old.avatar_path) as result;
--         if status <> 200 then
--             raise warning 'Could not delete avatar: % %', status, content;
--         end if;
--     end if;
--     if tg_op = 'DELETE' then
--         return old;
--     end if;
--     return new;
-- end;
-- $$;
-- create trigger delete_old_build_extra_images_trigger
--     before update of extra_images or delete on public.builds for each row
--     execute function public.delete_old_build_extra_images();
