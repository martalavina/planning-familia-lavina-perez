create table if not exists public.planner_state (
  id text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.planner_state enable row level security;
-- Sin policies públicas: solo accede la función servidor con service_role.
