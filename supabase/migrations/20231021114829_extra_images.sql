/*
 * Extra (build) Images bucket
 * Max 3MB. Image files only.
 */
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
    values ('images', 'images', true, 3000000, array['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

-- RLS
create policy "Images are publicly accessible." on storage.objects
    for select
        using (bucket_id = 'images');

create policy "Anyone can upload an image into their own folder." on storage.objects
    for insert
        with check (bucket_id = 'images'
        -- Check if the user is inserting into their own folder
        and (storage.foldername(name))[1] = auth.uid()::text
        -- Check if the user owns the associated schematic
        and exists (
            select
                1
            from
                schematics s
            where
                s.id =((storage.foldername(name))[2])::int and s.user_id = auth.uid()));

create policy "Image owner can delete their own images." on storage.objects
    for delete
        using (bucket_id = 'images'
            and auth.uid() = owner);
