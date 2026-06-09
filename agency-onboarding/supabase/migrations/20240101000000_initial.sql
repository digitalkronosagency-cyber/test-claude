-- Clients
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email text unique not null,
  phone text,
  city text,
  region text,
  revenue_range text,
  status text default 'invited',
  invite_token text unique default gen_random_uuid()::text,
  invite_sent_at timestamptz,
  delivery_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists onboarding_responses (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  section_key text not null,
  data jsonb not null default '{}',
  completed boolean default false,
  updated_at timestamptz default now(),
  unique(client_id, section_key)
);

create table if not exists project_steps (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  step_key text not null,
  step_name text not null,
  step_icon text default '📋',
  status text default 'todo',
  order_index integer not null,
  admin_notes text,
  client_message text,
  requires_approval boolean default false,
  approved_at timestamptz,
  estimated_date date,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  sender text not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists shared_files (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  filename text not null,
  original_name text not null,
  storage_path text not null,
  file_type text,
  size_bytes integer,
  uploaded_by text default 'admin',
  visible_to_client boolean default true,
  created_at timestamptz default now()
);

create table if not exists form_config (
  id integer primary key default 1,
  config jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- RLS
alter table clients enable row level security;
alter table onboarding_responses enable row level security;
alter table project_steps enable row level security;
alter table messages enable row level security;
alter table shared_files enable row level security;
alter table form_config enable row level security;

-- Allow service role full access (all operations via service_role key bypass RLS anyway)
create policy "service_role_all" on clients to service_role using (true) with check (true);
create policy "service_role_all" on onboarding_responses to service_role using (true) with check (true);
create policy "service_role_all" on project_steps to service_role using (true) with check (true);
create policy "service_role_all" on messages to service_role using (true) with check (true);
create policy "service_role_all" on shared_files to service_role using (true) with check (true);
create policy "service_role_all" on form_config to service_role using (true) with check (true);
