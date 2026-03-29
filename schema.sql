create table app_user (
  id text primary key,
  email text not null unique,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

create table brand_profile (
  id text primary key,
  user_id text not null references app_user(id),
  name text not null,
  niche text,
  tone text,
  colors jsonb,
  fonts jsonb,
  logo_asset_id text,
  created_at timestamptz not null default now()
);

create table project (
  id text primary key,
  user_id text not null references app_user(id),
  brand_profile_id text references brand_profile(id),
  title text not null,
  prompt text not null,
  platform text not null,
  style text,
  duration_seconds integer not null,
  status text not null default 'draft',
  source_type text not null default 'prompt',
  script_text text,
  hook text,
  cta text,
  captions_style jsonb,
  meta jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table asset (
  id text primary key,
  user_id text not null references app_user(id),
  project_id text references project(id),
  kind text not null,
  storage_key text not null,
  public_url text,
  mime_type text,
  duration_ms integer,
  width integer,
  height integer,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table generation_job (
  id text primary key,
  project_id text not null references project(id),
  user_id text not null references app_user(id),
  status text not null,
  current_step text,
  provider_map jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table generation_step (
  id text primary key,
  generation_job_id text not null references generation_job(id),
  step_name text not null,
  status text not null,
  provider text,
  input jsonb,
  output jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table publish_job (
  id text primary key,
  project_id text not null references project(id),
  user_id text not null references app_user(id),
  platform text not null,
  scheduled_for timestamptz,
  status text not null,
  remote_id text,
  error_message text,
  created_at timestamptz not null default now()
);

create table usage_event (
  id text primary key,
  user_id text not null references app_user(id),
  event_type text not null,
  units integer not null default 1,
  meta jsonb,
  created_at timestamptz not null default now()
);

