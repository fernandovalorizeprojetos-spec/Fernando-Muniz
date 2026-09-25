-- Initial Supabase schema for the project dashboard platform.
create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'client_editor', 'client_viewer');
create type public.membership_role as enum ('client_editor', 'client_viewer');
create type public.project_status as enum ('planned', 'active', 'paused', 'completed', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.clients (
  id uuid primary key default gen_random_uuid(), name text not null, legal_name text, email text, phone text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.projects (
  id uuid primary key default gen_random_uuid(), client_id uuid not null references public.clients(id) on delete cascade,
  name text not null, description text, status public.project_status not null default 'planned', starts_on date, ends_on date,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint projects_dates_valid check (ends_on is null or starts_on is null or ends_on >= starts_on)
);
create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade,
  role public.membership_role not null, created_at timestamptz not null default now(), primary key (project_id, user_id)
);
create table public.dashboard_templates (
  id uuid primary key default gen_random_uuid(), name text not null unique, description text, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.template_sections (
  id uuid primary key default gen_random_uuid(), template_id uuid not null references public.dashboard_templates(id) on delete cascade,
  type text not null, position integer not null check (position >= 0), default_configuration jsonb not null default '{}'::jsonb,
  unique (template_id, position), unique (template_id, type)
);
create table public.dashboards (
  id uuid primary key default gen_random_uuid(), project_id uuid not null unique references public.projects(id) on delete cascade,
  template_id uuid not null references public.dashboard_templates(id), name text not null default 'Dashboard do projeto',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.dashboard_sections (
  id uuid primary key default gen_random_uuid(), dashboard_id uuid not null references public.dashboards(id) on delete cascade,
  type text not null, position integer not null check (position >= 0), is_enabled boolean not null default true,
  configuration jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (dashboard_id, position), unique (dashboard_id, type)
);
create table public.metrics (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade, name text not null, value numeric,
  unit text, target numeric, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.phases (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade, name text not null, description text,
  starts_on date, ends_on date, position integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.tasks (
  id uuid primary key default gen_random_uuid(), phase_id uuid not null references public.phases(id) on delete cascade, name text not null, description text,
  assignee_id uuid references public.profiles(id) on delete set null, status text not null default 'pending', due_on date, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.team_members (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade, profile_id uuid references public.profiles(id) on delete set null,
  name text not null, role text, organization text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.modules (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade, name text not null, description text,
  status text, position integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.decisions (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade, title text not null, description text,
  decided_at date, owner_id uuid references public.profiles(id) on delete set null, status text not null default 'open', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade, storage_path text not null, title text,
  description text, mime_type text, created_by uuid references public.profiles(id) on delete set null, created_at timestamptz not null default now()
);
create table public.documents (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade, storage_path text not null, name text not null,
  mime_type text, size_bytes bigint, created_by uuid references public.profiles(id) on delete set null, created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.profiles where id = auth.uid() and (select raw_app_meta_data->>'role' from auth.users where id = auth.uid()) = 'admin'); $$;
create or replace function public.can_access_project(target_project_id uuid) returns boolean language sql stable security definer set search_path = public as $$ select public.is_admin() or exists (select 1 from public.project_members where project_id = target_project_id and user_id = auth.uid()); $$;
create or replace function public.can_edit_project(target_project_id uuid) returns boolean language sql stable security definer set search_path = public as $$ select public.is_admin() or exists (select 1 from public.project_members where project_id = target_project_id and user_id = auth.uid() and role = 'client_editor'); $$;
create or replace function public.project_id_for_phase(target_phase_id uuid) returns uuid language sql stable security definer set search_path = public as $$ select project_id from public.phases where id = target_phase_id; $$;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email)); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into public.dashboard_templates (name, description) values ('Projeto Cultural', 'Template inicial para projetos culturais') on conflict (name) do nothing;
insert into public.template_sections (template_id, type, position)
select id, section, position from public.dashboard_templates cross join unnest(array['Visão Geral','Métricas','Gráficos','Cronograma','Equipe','Formação','Acessibilidade','Decisões','Galeria']) with ordinality as sections(section, position) where name = 'Projeto Cultural' on conflict do nothing;

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.dashboard_templates enable row level security;
alter table public.template_sections enable row level security;
alter table public.dashboards enable row level security;
alter table public.dashboard_sections enable row level security;
alter table public.metrics enable row level security;
alter table public.phases enable row level security;
alter table public.tasks enable row level security;
alter table public.team_members enable row level security;
alter table public.modules enable row level security;
alter table public.decisions enable row level security;
alter table public.gallery_items enable row level security;
alter table public.documents enable row level security;

create policy "profiles own or admin read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles own update" on public.profiles for update using (id = auth.uid());
create policy "admins manage clients" on public.clients for all using (public.is_admin()) with check (public.is_admin());
create policy "members read clients" on public.clients for select using (public.is_admin() or exists (select 1 from public.projects p join public.project_members pm on pm.project_id = p.id where p.client_id = clients.id and pm.user_id = auth.uid()));
create policy "project access read" on public.projects for select using (public.can_access_project(id));
create policy "admin manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "editor update projects" on public.projects for update using (public.can_edit_project(id)) with check (public.can_edit_project(id));
create policy "members read own membership" on public.project_members for select using (public.can_access_project(project_id));
create policy "admins manage memberships" on public.project_members for all using (public.is_admin()) with check (public.is_admin());
create policy "active templates read" on public.dashboard_templates for select using (is_active or public.is_admin());
create policy "template sections read" on public.template_sections for select using (exists (select 1 from public.dashboard_templates t where t.id = template_id and (t.is_active or public.is_admin())));
create policy "admin manage templates" on public.dashboard_templates for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage template sections" on public.template_sections for all using (public.is_admin()) with check (public.is_admin());
create policy "dashboard access" on public.dashboards for select using (public.can_access_project(project_id));
create policy "admin create dashboards" on public.dashboards for insert with check (public.is_admin());
create policy "editor update dashboard" on public.dashboards for update using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));
create policy "dashboard sections access" on public.dashboard_sections for select using (exists (select 1 from public.dashboards d where d.id = dashboard_id and public.can_access_project(d.project_id)));
create policy "dashboard sections edit" on public.dashboard_sections for insert with check (exists (select 1 from public.dashboards d where d.id = dashboard_id and public.can_edit_project(d.project_id)));
create policy "dashboard sections update" on public.dashboard_sections for update using (exists (select 1 from public.dashboards d where d.id = dashboard_id and public.can_edit_project(d.project_id))) with check (exists (select 1 from public.dashboards d where d.id = dashboard_id and public.can_edit_project(d.project_id)));
create policy "dashboard sections delete" on public.dashboard_sections for delete using (public.is_admin());

-- Project-scoped content follows the same access model. The phase helper avoids exposing unrelated rows.
create policy "metrics access" on public.metrics for select using (public.can_access_project(project_id));
create policy "metrics edit" on public.metrics for all using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));
create policy "phases access" on public.phases for select using (public.can_access_project(project_id));
create policy "phases edit" on public.phases for all using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));
create policy "tasks access" on public.tasks for select using (public.can_access_project(public.project_id_for_phase(phase_id)));
create policy "tasks edit" on public.tasks for all using (public.can_edit_project(public.project_id_for_phase(phase_id))) with check (public.can_edit_project(public.project_id_for_phase(phase_id)));
create policy "team access" on public.team_members for select using (public.can_access_project(project_id));
create policy "team edit" on public.team_members for all using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));
create policy "modules access" on public.modules for select using (public.can_access_project(project_id));
create policy "modules edit" on public.modules for all using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));
create policy "decisions access" on public.decisions for select using (public.can_access_project(project_id));
create policy "decisions edit" on public.decisions for all using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));
create policy "gallery access" on public.gallery_items for select using (public.can_access_project(project_id));
create policy "gallery edit" on public.gallery_items for all using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));
create policy "documents access" on public.documents for select using (public.can_access_project(project_id));
create policy "documents edit" on public.documents for all using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));

insert into storage.buckets (id, name, public) values ('project-assets', 'project-assets', false) on conflict (id) do nothing;
create policy "project asset read" on storage.objects for select using (bucket_id = 'project-assets' and public.can_access_project((storage.foldername(name))[1]::uuid));
create policy "project asset upload" on storage.objects for insert with check (bucket_id = 'project-assets' and public.can_edit_project((storage.foldername(name))[1]::uuid));
create policy "project asset update" on storage.objects for update using (bucket_id = 'project-assets' and public.can_edit_project((storage.foldername(name))[1]::uuid));
create policy "project asset delete" on storage.objects for delete using (bucket_id = 'project-assets' and public.is_admin());
