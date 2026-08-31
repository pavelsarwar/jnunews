-- JnU News Storage policies for the public `news-images` bucket.
-- Run once in Supabase SQL Editor after creating the bucket.

create policy "Public can view news images"
on storage.objects for select
to public
using (bucket_id = 'news-images');

create policy "Authenticated users can upload news images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'news-images');

create policy "Authenticated users can update news images"
on storage.objects for update
to authenticated
using (bucket_id = 'news-images')
with check (bucket_id = 'news-images');

create policy "Authenticated users can delete news images"
on storage.objects for delete
to authenticated
using (bucket_id = 'news-images');
