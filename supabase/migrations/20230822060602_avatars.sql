/*
 * Avatars bucket
 */
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
    values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

create policy "Avatar images are publicly accessible." on storage.objects
    for select
        using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar into their own folder." on storage.objects
    for insert
        with check (bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Image owner can delete their own avatar." on storage.objects
    for delete
        using (bucket_id = 'avatars'
            and auth.uid() = owner);


/*
 * Delete Avatar helper function
 */
create or replace function delete_avatar(avatar_path text, out status int, out content text)
    returns record
    language 'plpgsql'
    security definer
    as $$
begin
    select
        into status,
        content result.status,
        result.content
    from
        public.delete_storage_object('avatars', avatar_path) as result;
end;
$$;


/*
 * Handle delete old avatar trigger
 * TODO: delete all uploaded images, not just the old one
 */
create or replace function delete_old_avatar()
    returns trigger
    language 'plpgsql'
    security definer
    as $$
declare
    status int;
    content text;
    avatar_name text;
begin
    if coalesce(old.avatar_path, '') <> '' and (tg_op = 'DELETE' or (old.avatar_path <> new.avatar_path)) then
        -- extract avatar name
        avatar_name := old.avatar_path;
        select
            into status,
            content result.status,
            result.content
        from
            public.delete_avatar(avatar_name) as result;
        if status <> 200 then
            raise warning 'Could not delete avatar: % %', status, content;
        end if;
    end if;
    if tg_op = 'DELETE' then
        return old;
    end if;
    return new;
end;
$$;

create trigger before_profile_changes
    before update of avatar_path or delete on public.users for each row
    execute function public.delete_old_avatar();
