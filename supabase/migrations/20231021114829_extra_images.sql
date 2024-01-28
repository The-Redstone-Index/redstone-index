/*
 * Images bucket
 */
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
    values ('images', 'images', true, 5242880, array['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

-- RLS
create policy "Images are publicly accessible." on storage.objects
    for select
        using (bucket_id = 'images');

create policy "Anyone can upload an image into their own folder." on storage.objects
    for insert
        with check (bucket_id = 'images'
        and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Image owner can delete their own images." on storage.objects
    for delete
        using (bucket_id = 'images'
            and auth.uid() = owner);
