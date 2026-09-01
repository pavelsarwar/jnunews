grant usage on schema public to anon, authenticated;

grant select on table public.categories to anon;
grant select on table public.articles to anon;

grant select, insert, update, delete on table public.categories to authenticated;
grant select, insert, update, delete on table public.articles to authenticated;

grant usage, select on sequence public.categories_id_seq to authenticated;
grant usage, select on sequence public.articles_id_seq to authenticated;
