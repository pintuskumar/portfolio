create extension if not exists vector;

create table public.kb_chunks (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  heading text,
  content text not null,
  embedding vector(1536) not null,
  token_estimate int,
  created_at timestamptz not null default now()
);

create index kb_chunks_embedding_idx
  on public.kb_chunks using hnsw (embedding vector_cosine_ops);

grant select on public.kb_chunks to anon;
grant select on public.kb_chunks to authenticated;
grant all on public.kb_chunks to service_role;

alter table public.kb_chunks enable row level security;

create policy "kb is publicly readable"
  on public.kb_chunks for select
  using (true);

create or replace function public.match_kb_chunks(
  query_embedding vector(1536),
  match_count int default 6
)
returns table (id uuid, source text, heading text, content text, similarity float)
language sql
stable
set search_path = public
as $$
  select c.id, c.source, c.heading, c.content,
         1 - (c.embedding <=> query_embedding) as similarity
  from public.kb_chunks c
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

grant execute on function public.match_kb_chunks(vector, int) to anon;
grant execute on function public.match_kb_chunks(vector, int) to authenticated;