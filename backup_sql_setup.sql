-- ==========================================
-- STEP 1: ENABLE RLS ON ALL TABLES
-- ==========================================

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.goals enable row level security;

-- ==========================================
-- STEP 2: DEFINE RLS POLICIES
-- ==========================================

-- Profiles: Users can only see and update their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Transactions: Users can manage their own transactions
create policy "Users can manage own transactions" on public.transactions 
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Budgets: Users can manage their own budgets
create policy "Users can manage own budgets" on public.budgets 
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Goals: Users can manage their own goals
create policy "Users can manage own goals" on public.goals 
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==========================================
-- STEP 3: AUTOMATIC PROFILE CREATION TRIGGER
-- ==========================================

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

-- trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
