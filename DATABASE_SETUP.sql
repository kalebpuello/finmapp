-- ==========================================================
-- FINMAPP DATABASE SETUP (EJECUTAR EN SUPABASE SQL EDITOR)
-- ==========================================================

-- 1. CREACIÓN DE TABLAS BASE
-- ==========================================================

-- Perfiles de usuario vinculados a Auth
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  username text,
  total_balance decimal default 0,
  currency text default 'COP',
  language text default 'es',
  last_version_seen text default '1.0.0',
  updated_at timestamp with time zone default now()
);

-- Transacciones (Ingresos y Egresos)
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount decimal not null,
  category text not null,
  type text check (type in ('income', 'expense')),
  description text,
  created_at timestamp with time zone default now()
);

-- Presupuestos mensuales
create table if not exists public.budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category text not null,
  limit_amount decimal not null,
  current_spent decimal default 0
);

-- Metas de ahorro
create table if not exists public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  target_amount decimal not null,
  current_saved decimal default 0
);

-- Notificaciones personales y avisos de sistema
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text default 'info', -- 'info', 'success', 'warning', 'error'
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- 2. ACTIVAR ROW LEVEL SECURITY (RLS)
-- ==========================================================

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.goals enable row level security;
alter table public.notifications enable row level security;

-- 3. POLÍTICAS DE SEGURIDAD
-- ==========================================================

-- Profiles: Usuarios ven y editan solo su perfil
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Notifications: Usuarios manejan solo sus notificaciones
create policy "Users can manage own notifications" on public.notifications 
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Transactions: Usuarios manejan solo sus transacciones
create policy "Users can manage own transactions" on public.transactions 
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Budgets: Usuarios manejan solo sus presupuestos
create policy "Users can manage own budgets" on public.budgets 
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Goals: Usuarios manejan solo sus metas
create policy "Users can manage own goals" on public.goals 
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. AUTOMATIZACIÓN (TRIGGERS)
-- ==========================================================

-- Función para crear perfil automáticamente al registrarse en Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, total_balance, currency, language)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), 
    0,
    coalesce(new.raw_user_meta_data->>'currency', 'COP'),
    coalesce(new.raw_user_meta_data->>'language', 'es')
  );
  return new;
end;
$$;

-- Trigger: On Auth Signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. FUNCIÓN PARA ELIMINACIÓN DE CUENTA (BAJA DE USUARIO)
-- ==========================================================
create or replace function public.delete_user_account()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  -- Al borrar el usuario de auth.users, el perfil y los datos 
  -- relacionados se borrarán por las restricciones de FK (Foreign Key)
  delete from auth.users where id = auth.uid();
end;
$$;
