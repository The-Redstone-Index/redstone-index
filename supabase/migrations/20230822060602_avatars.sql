/*
 * Avatars bucket
 * Max 1MB. Image files only.
 */
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
    values ('avatars', 'avatars', true, 1000000, array['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

-- RLS
create policy "Avatar images are publicly accessible." on storage.objects
    for select
        using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar into their own folder." on storage.objects
    for insert
        with check (
        -- Avatars bucket
        bucket_id = 'avatars'
        -- Check the user is uploading into their own folder
        and (storage.foldername(name))[1] = auth.uid()::text
        -- Max 5 images uploaded to this folder
        and (
            select
                COUNT(*)
            from
                storage.objects so
            where
                so.bucket_id = 'avatars' and storage.foldername(so.name) = storage.foldername(name)) < 5);

create policy "Image owner can delete their own avatar." on storage.objects
    for delete
        using (bucket_id = 'avatars'
            and auth.uid() = owner);
