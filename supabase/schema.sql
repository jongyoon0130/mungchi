-- 뭉치 데이터베이스 설정
--
-- Supabase 대시보드 > SQL Editor 에 이 파일 전체를 붙이고 Run 을 누르면 됩니다.
-- 여러 번 실행해도 안전합니다. 경매로 만들어 둔 예전 테이블이 있으면
-- 4번 항목이 알아서 정찰가 구조로 옮겨 줍니다.

-- ─────────────────────────────────────────────────────────────
-- 1. 묶음 테이블
-- ─────────────────────────────────────────────────────────────
create table if not exists public.lots (
  id              text primary key,          -- 묶음 번호 (L-001)
  title           text        not null,
  summary         text        not null default '',
  department      text        not null default 'unisex'
                              check (department in ('men', 'women', 'unisex', 'kids')),
  category        text        not null,
  brand           text        not null default '',  -- 공개 필터 준비용. 지금은 등록만.
  grade           text        not null,
  season          text        not null,
  pieces          integer     not null check (pieces > 0),
  weight_kg       numeric     not null check (weight_kg >= 0),
  origin          text        not null default '',
  contents        text[]      not null default '{}',
  condition_notes text        not null default '',
  photos          text[]      not null default '{}',
  video           text,                      -- 묶음을 넘겨 보여주는 영상 (없으면 null)
  price           integer     not null check (price >= 0),
  list_price      integer     check (list_price is null or list_price >= price),
  free_shipping   boolean     not null default false,
  status          text        not null default 'available'
                              check (status in ('available', 'reserved', 'sold')),
  listed_at       timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 2. 예전 경매 테이블에서 옮겨오기
--
-- 경매로 쓰던 컬럼이 남아 있으면 정찰가 구조로 바꿔 준다.
-- 처음 설치하는 경우에는 아무 일도 하지 않는다.
-- ─────────────────────────────────────────────────────────────
do $$
begin
  -- 새 컬럼부터 만든다
  alter table public.lots add column if not exists department    text;
  alter table public.lots add column if not exists brand         text;
  alter table public.lots add column if not exists video         text;
  alter table public.lots add column if not exists price         integer;
  alter table public.lots add column if not exists list_price    integer;
  alter table public.lots add column if not exists free_shipping boolean;
  alter table public.lots add column if not exists listed_at     timestamptz;

  -- 시작가·즉시구매가를 판매가로 옮긴다
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'lots' and column_name = 'start_price'
  ) then
    update public.lots
       set price = coalesce(price, buy_now_price, start_price)
     where price is null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'lots' and column_name = 'starts_at'
  ) then
    update public.lots set listed_at = coalesce(listed_at, starts_at) where listed_at is null;
  end if;

  -- 경매 상태를 판매 상태로 바꾼다
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'lots' and column_name = 'status'
  ) then
    alter table public.lots drop constraint if exists lots_status_check;
    update public.lots set status = 'available' where status in ('scheduled', 'live');
    update public.lots set status = 'sold'      where status = 'ended';
  end if;

  -- 빈칸 채우고 제약을 건다
  update public.lots set department    = 'unisex' where department is null;
  update public.lots set brand         = coalesce(brand, '') where brand is null;
  update public.lots set free_shipping = false    where free_shipping is null;
  update public.lots set listed_at     = now()    where listed_at is null;
  update public.lots set price         = 0        where price is null;

  alter table public.lots alter column department    set not null;
  alter table public.lots alter column brand         set default '';
  alter table public.lots alter column free_shipping set not null;
  alter table public.lots alter column listed_at     set not null;
  alter table public.lots alter column price         set not null;

  -- 경매에만 쓰던 컬럼은 버린다
  alter table public.lots drop constraint if exists ends_after_starts;
  alter table public.lots drop column if exists start_price;
  alter table public.lots drop column if exists bid_increment;
  alter table public.lots drop column if exists buy_now_price;
  alter table public.lots drop column if exists current_bid;
  alter table public.lots drop column if exists bid_count;
  alter table public.lots drop column if exists starts_at;
  alter table public.lots drop column if exists ends_at;
end $$;

-- 제약은 컬럼이 다 자리잡은 뒤에 건다
alter table public.lots drop constraint if exists lots_status_check;
alter table public.lots add  constraint lots_status_check
  check (status in ('available', 'reserved', 'sold'));

alter table public.lots drop constraint if exists lots_department_check;
alter table public.lots add  constraint lots_department_check
  check (department in ('men', 'women', 'unisex', 'kids'));

alter table public.lots drop constraint if exists lots_price_check;
alter table public.lots add  constraint lots_price_check check (price >= 0);

alter table public.lots drop constraint if exists lots_list_price_check;
alter table public.lots add  constraint lots_list_price_check
  check (list_price is null or list_price >= price);

-- ─────────────────────────────────────────────────────────────
-- 3. 자주 쓰는 정렬·검색
-- ─────────────────────────────────────────────────────────────
drop index if exists lots_ends_at_idx;
create index if not exists lots_listed_at_idx  on public.lots (listed_at desc);
create index if not exists lots_status_idx     on public.lots (status);
create index if not exists lots_department_idx on public.lots (department);
create index if not exists lots_category_idx   on public.lots (category);
create index if not exists lots_brand_idx      on public.lots (brand);

-- ─────────────────────────────────────────────────────────────
-- 4. 접근 권한
--
-- 묶음은 누구나 볼 수 있어야 하지만, 올리고 고치는 건 로그인한
-- 도매 계정만 할 수 있어야 한다.
-- ─────────────────────────────────────────────────────────────
alter table public.lots enable row level security;

drop policy if exists "경매는 누구나 볼 수 있다" on public.lots;
drop policy if exists "묶음은 누구나 볼 수 있다" on public.lots;
create policy "묶음은 누구나 볼 수 있다"
  on public.lots for select
  using (true);

drop policy if exists "관리자만 경매를 올린다" on public.lots;
drop policy if exists "판매자만 묶음을 올린다" on public.lots;
create policy "판매자만 묶음을 올린다"
  on public.lots for insert
  to authenticated
  with check (true);

drop policy if exists "관리자만 경매를 고친다" on public.lots;
drop policy if exists "판매자만 묶음을 고친다" on public.lots;
create policy "판매자만 묶음을 고친다"
  on public.lots for update
  to authenticated
  using (true);

drop policy if exists "관리자만 경매를 지운다" on public.lots;
drop policy if exists "판매자만 묶음을 지운다" on public.lots;
create policy "판매자만 묶음을 지운다"
  on public.lots for delete
  to authenticated
  using (true);

-- ─────────────────────────────────────────────────────────────
-- 5. 사진·영상 저장소
--
-- 같은 버킷에 사진과 영상을 함께 둔다. 영상은 용량이 커서
-- 버킷 자체에 50MB 상한을 걸어 실수로 큰 파일이 올라가는 걸 막는다.
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lot-photos', 'lot-photos', true, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'video/mp4', 'video/quicktime', 'video/webm']
)
on conflict (id) do update
  set public             = true,
      file_size_limit    = 52428800,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "사진은 누구나 본다" on storage.objects;
create policy "사진은 누구나 본다"
  on storage.objects for select
  using (bucket_id = 'lot-photos');

drop policy if exists "관리자만 사진을 올린다" on storage.objects;
drop policy if exists "판매자만 사진을 올린다" on storage.objects;
create policy "판매자만 사진을 올린다"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'lot-photos');

drop policy if exists "관리자만 사진을 바꾼다" on storage.objects;
drop policy if exists "판매자만 사진을 바꾼다" on storage.objects;
create policy "판매자만 사진을 바꾼다"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'lot-photos');

drop policy if exists "관리자만 사진을 지운다" on storage.objects;
drop policy if exists "판매자만 사진을 지운다" on storage.objects;
create policy "판매자만 사진을 지운다"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'lot-photos');
