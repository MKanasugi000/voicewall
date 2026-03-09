-- VoiceWall MVP Migration
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/viirgzvyqmiiommyrhsm/sql)

-- Enable UUID extension (if not already enabled)
create extension if not exists "uuid-ossp";

-- 1. Projects table
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  owner_email text,
  settings jsonb default '{}',
  created_at timestamp with time zone default now()
);

-- 2. Testimonials table
create table if not exists testimonials (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade,
  customer_name text not null,
  customer_email text,
  customer_title text,
  rating integer check (rating >= 1 and rating <= 5) default 5,
  content text not null,
  is_published boolean default false,
  consent boolean default true,
  metadata jsonb default '{}',
  created_at timestamp with time zone default now()
);

-- 3. RLS Policies

-- Projects: allow public read by slug
alter table projects enable row level security;

create policy "Allow public read projects by slug"
  on projects for select
  to public
  using (true);

create policy "Allow public insert projects"
  on projects for insert
  to public
  with check (true);

-- Testimonials: allow public insert & read published
alter table testimonials enable row level security;

create policy "Allow public insert testimonials"
  on testimonials for insert
  to public
  with check (true);

create policy "Allow public read published testimonials"
  on testimonials for select
  to public
  using (is_published = true);

create policy "Allow read all testimonials for dashboard"
  on testimonials for select
  to public
  using (true);

create policy "Allow update testimonials"
  on testimonials for update
  to public
  using (true)
  with check (true);

-- 4. Create a demo project
insert into projects (name, slug, owner_email) values
  ('VoiceWall Demo', 'demo', 'mildsolt.official@gmail.com')
on conflict (slug) do nothing;

-- 5. Insert sample testimonials for the demo project
insert into testimonials (project_id, customer_name, customer_title, rating, content, is_published) values
  ((select id from projects where slug = 'demo'), '田中 美咲', 'デザインスタジオ代表', 5, '口コミの収集がこんなに簡単だとは思いませんでした。導入して2週間で20件以上集まりました！', true),
  ((select id from projects where slug = 'demo'), '佐藤 健一', '株式会社テックラボ CEO', 5, 'ウィジェットのデザインが美しく、サイトのコンバージョン率が15%向上しました。', true),
  ((select id from projects where slug = 'demo'), '鈴木 遥', 'フリーランスデザイナー', 4, 'シンプルで使いやすいUIが気に入っています。メール自動リクエスト機能が特に便利です。', true)
on conflict do nothing;
