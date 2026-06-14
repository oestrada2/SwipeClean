create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.cleanup_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.media_decisions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.cleanup_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  device_asset_id text not null,
  media_kind text not null check (media_kind in ('photo', 'video')),
  decision text not null check (decision in ('keep', 'delete')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.cleanup_sessions enable row level security;
alter table public.media_decisions enable row level security;

create policy "Users can read their profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can manage their cleanup sessions"
  on public.cleanup_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their media decisions"
  on public.media_decisions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
