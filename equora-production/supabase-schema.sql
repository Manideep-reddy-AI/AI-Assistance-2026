-- ═══════════════════════════════════════════════════════════
-- EQUORA DATABASE SCHEMA
-- Run this in: Supabase → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  plan text default 'free' check (plan in ('free', 'pro')),
  analyses_used integer default 0,
  research_used integer default 0,
  razorpay_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Portfolios table
create table public.portfolios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  stocks_count integer default 0,
  total_invested numeric default 0,
  total_value numeric default 0,
  pl_percent numeric default 0,
  analysis_html text,
  raw_data jsonb,
  created_at timestamptz default now()
);

-- Subscriptions table
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  amount integer not null,
  status text default 'pending' check (status in ('pending', 'paid', 'failed')),
  plan text not null,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.portfolios enable row level security;
alter table public.subscriptions enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own portfolios" on public.portfolios for select using (auth.uid() = user_id);
create policy "Users can insert own portfolios" on public.portfolios for insert with check (auth.uid() = user_id);
create policy "Users can delete own portfolios" on public.portfolios for delete using (auth.uid() = user_id);
create policy "Users can view own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Service role can insert subscriptions" on public.subscriptions for insert with check (true);
create policy "Service role can update subscriptions" on public.subscriptions for update using (true);
