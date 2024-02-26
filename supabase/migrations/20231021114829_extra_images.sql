/*
 * Extra (build) Images bucket
 * Max 1MB. Image files only.
 */
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
    values ('images', 'images', true, 1000000, array['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

-- RLS
create policy "Images are publicly accessible." on storage.objects
    for select
        using (bucket_id = 'images');

create policy "Anyone can upload an image into their own build folder." on storage.objects
    for insert
        with check (
        -- Images bucket
        bucket_id = 'images'
        -- Check if the user is uploading into their own folder
        and (storage.foldername(name))[1] = auth.uid()::text
        -- Check if the user owns the associated schematic
        and exists (
            select
                1
            from
                schematics s
            where
                s.id =((storage.foldername(name))[2])::int and s.user_id = auth.uid())
                -- Max 20 images uploaded to this folder
                and (
                    select
                        COUNT(*)
                    from
                        storage.objects so
                    where
                        so.bucket_id = 'images' and storage.foldername(so.name) = storage.foldername(name)) < 20);

create policy "Image owner can delete their own images." on storage.objects
    for delete
        using (bucket_id = 'images'
            and auth.uid() = owner);
