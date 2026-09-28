# 뭉치

검품하고 사진·영상까지 찍은 구제·빈티지 의류 묶음을 **정찰가**로 거래하는
사이트입니다. 도매업체가 받고 싶은 가격을 직접 적어 올리고, 소매업체는 그 값을
보고 살지 말지만 정합니다. 경매나 입찰은 없습니다.

> 이름 `뭉치`는 임시입니다. 바꾸려면 `src/config.ts`의 `site.name`과
> `src/components/Logo.tsx`만 고치면 됩니다.

## 실행

```bash
bun install
bun run dev      # http://localhost:5173
bun run build    # dist/ 로 정적 빌드
```

## 두 갈래 입구

오는 사람이 파는 쪽인지 사는 쪽인지에 따라 첫 화면이 갈립니다.

| 대상 | 입구 | 하는 일 |
| --- | --- | --- |
| 도매업체 (파는 쪽) | `/sell` | 올리는 방법을 보고 `/register` 로 넘어갑니다 |
| 소매업체 (사는 쪽) | `/signup` | 묶음 목록 `/bundles` 로 넘어갑니다 |

헤더 오른쪽의 **도매업체 입점** / **소매업체 가입** 버튼이 각각 이 두 곳으로
갑니다.

## 묶음을 올리는 방법

1. 묶음을 펼쳐 놓고 사진을 찍고, 옷을 한 장씩 넘겨 가며 영상을 찍습니다.
2. `/register` 에 들어가 사진과 영상을 고르고 정보를 채웁니다. 채우는 동안
   오른쪽에서 목록에 어떻게 보일지 미리 확인할 수 있고, 안 채운 항목도
   표시됩니다.
3. **묶음 등록하기** 버튼을 누르면 끝입니다. 파일이 올라가고 바로 묶음
   페이지로 넘어갑니다.

올린 묶음은 `/admin` 에서 관리합니다. 판매 상태를 바꾸거나 지울 수 있습니다.
묶음이 하나도 없으면 홈과 목록이 자동으로 "준비 중" 상태로 바뀝니다.

### 사진과 영상

- **사진**은 여러 장을 한 번에 고릅니다. 첫 장이 대표 사진입니다.
- **영상**은 한 편만 올라가고, 없어도 등록됩니다. mp4 · mov · webm 을 받고
  50MB까지입니다. 이 한도는 `supabase/schema.sql` 의 버킷 설정과
  `src/lib/supabase.ts` 의 `MAX_VIDEO_BYTES` 두 곳에 같은 값으로 들어 있습니다.
- 상세 페이지 썸네일은 **대표 사진 → 영상 → 나머지 사진** 순서로 놓입니다.
  영상이 있는 묶음은 목록 카드 오른쪽 위에 재생 표시가 붙습니다.

## 서버 연결

서버를 붙이지 않으면 **연습 모드**로 동작합니다. 등록한 묶음이 그 브라우저에만
저장되고 다른 사람은 볼 수 없습니다. 실제로 공개하려면 아래를 한 번만 하면
됩니다. 무료이고 카드도 필요 없습니다.

### 1. Supabase 프로젝트 만들기

[supabase.com](https://supabase.com) 에 가입하고 **New project**를 누릅니다.
Region은 `Northeast Asia (Seoul)`을 고르면 국내에서 가장 빠릅니다.
Database Password는 따로 적어 두세요.

### 2. 데이터베이스 만들기

대시보드 왼쪽 **SQL Editor**로 들어가서 이 저장소의 `supabase/schema.sql`
내용을 전부 복사해 붙이고 **Run**을 누릅니다. 묶음 테이블, 사진·영상 저장소,
접근 권한이 한 번에 만들어집니다. 여러 번 실행해도 안전합니다.

> 경매로 쓰던 시절의 테이블이 이미 있다면 같은 파일이 알아서 정찰가 구조로
> 옮겨 줍니다. 즉시구매가가 있던 묶음은 그 값이, 없으면 시작가가 판매가가
> 됩니다.

### 3. 키 넣기

대시보드 **Project Settings > API** 에서 두 값을 가져옵니다.

```bash
cp .env.example .env
```

`.env` 를 열어 채웁니다.

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

`anon` / `public` 키를 쓰세요. `service_role` 키는 절대 넣으면 안 됩니다.
브라우저에 노출되면 누구나 데이터를 지울 수 있습니다.

### 4. 구글 로그인 켜기

코드는 이미 붙어 있습니다. 대시보드에서 Google 제공자만 켜면 됩니다.

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 에서
   OAuth 클라이언트 ID(웹 애플리케이션)를 만듭니다.
2. **승인된 리디렉션 URI**에 아래를 넣습니다.

   `https://pwcyrdwcbccefgmnqsbr.supabase.co/auth/v1/callback`

3. Supabase 대시보드 **Authentication > Providers > Google** 을 켜고
   Client ID와 Client Secret을 붙여 넣습니다.
4. **Authentication > URL Configuration** 의 Redirect URLs에 아래를 넣습니다.

   ```
   http://localhost:5180/**
   https://moongchi-market.vercel.app/**
   https://moongchi-theta.vercel.app/**
   ```

5. **Authentication > Providers** (또는 Sign In / Providers)에서
   **새 사용자 가입(Sign ups)** 이 꺼져 있지 않은지 확인합니다. 꺼져 있으면
   구글 로그인은 되어도 계정이 만들어지지 않습니다.

6. **구글 OAuth를 프로덕션으로 게시** (누구나 구글 계정으로 로그인):

   - [Google Cloud Console](https://console.cloud.google.com/apis/credentials/consent)
     → 프로젝트 **moongchi** 선택 → **Google Auth Platform** → **대상**
     (예전 UI: **OAuth consent screen**).
   - **게시 상태**가 **Testing(테스트)** 이면 **테스트 사용자**에 등록된 Gmail만
     로그인할 수 있습니다. **Production(프로덕션)** 으로 **Publish app(앱 게시)** 를
     누르면 일반 구글 계정도 로그인할 수 있습니다.
   - 앱 이름·로고·개인정보처리방침 URL·이용약관 URL·앱 도메인
     (`moongchi-market.vercel.app`)을 채워야 심사·게시가 통과하는 경우가
     많습니다. 내부용·초기 단계면 **External(외부)** + 필요한 항목만 최소로
     넣고 게시합니다.
   - 게시 후 Supabase·뭉치 코드는 그대로 두면 됩니다. 로그인에 성공한
     **모든** 구글 계정이 판매자 권한(묶음 등록·관리)을 갖습니다. 특정
     이메일만 허용하려면 별도 allowlist를 DB/RLS에 추가해야 합니다.

헤더 오른쪽 **로그인** / **로그아웃** 과 `/login` 페이지에서 판매자 로그인을
할 수 있습니다. 이메일·비밀번호 로그인은 `/login` 에서 접을 수 있습니다.

### 접근 권한 정리

| 누가 | 묶음 보기 | 등록·수정·삭제 |
| --- | --- | --- |
| 아무나 | 가능 | 불가 |
| 로그인한 판매자 | 가능 | 가능 |

`supabase/schema.sql` 의 Row Level Security 정책으로 막혀 있어서, 키가 공개돼도
로그인 없이는 아무것도 바꿀 수 없습니다.

## 배포

Vercel에 올립니다. 프로젝트 이름이 그대로 주소가 되므로 `moongchi` 로 만들면
`moongchi.vercel.app` 이 됩니다.

```bash
bunx vercel login          # 한 번만. 브라우저가 열립니다
bunx vercel link --project moongchi --yes
bunx vercel --prod
```

배포한 사이트도 Supabase를 읽어야 하므로 키 두 개를 Vercel에 따로 넣어야
합니다. `.env` 는 올라가지 않습니다.

```bash
bunx vercel env add VITE_SUPABASE_URL production
bunx vercel env add VITE_SUPABASE_ANON_KEY production
```

`vercel.json` 이 하는 일은 두 가지입니다.

- **SPA 되돌리기** — `/bundles/L-001` 같은 주소를 직접 치거나 새로고침해도
  404가 나지 않게 전부 `index.html` 로 넘깁니다. `dist` 안에 실제 파일이 있으면
  그게 먼저 나가므로 사진이나 번들은 영향받지 않습니다.
- **캐시** — 파일명에 해시가 붙는 `/assets/*` 는 영구 캐시로 돌립니다.

링크를 카카오톡 같은 데 붙였을 때 보이는 미리보기는 `public/og.png` 와
`index.html` 의 `og:` 태그입니다. 문구를 바꾸면 두 곳을 같이 고쳐야 합니다.

## 그 외 채워야 할 것

`src/config.ts` 의 `contactEmail` 이 비어 있습니다. 여기에 실제 이메일을 넣어야
알림 신청과 **구매 신청** 버튼이 동작합니다. 비어 있는 동안에는 "준비 중"으로
표시됩니다.

## 판매 기본값

`src/config.ts` 의 `sellingRules` 에 있습니다.

| 항목 | 기본값 | 설명 |
| --- | --- | --- |
| 무료배송 기준 | 300,000원 | 넘으면 등록 양식이 무료배송을 켭니다 |
| 하자 환불 | 7일 | 설명에 없던 하자면 전액 환불 |

**정가**는 묶음마다 선택입니다. 등록할 때 비워 두면 판매가만 나오고, 값을
넣으면 취소선과 할인율이 같이 붙습니다.

## 페이지

| 경로 | 설명 | 로그인 |
| --- | --- | --- |
| `/` | 홈. 거래 방식, 지키는 것, 다룰 품목, FAQ | |
| `/sell` | 도매업체 입구. 올리는 방법과 규칙 | |
| `/signup` | 소매업체 입구. 무엇이 좋은지와 품목 | |
| `/bundles` | 묶음 목록. 상태·부문·카테고리·등급 필터와 4가지 정렬 | |
| `/bundles/:id` | 묶음 상세. 사진·영상, 개당 단가, 구매 신청 | |
| `/login` | 판매자 로그인 (구글·이메일) | |
| `/admin` | 묶음 관리. 상태 변경과 삭제 | 필요 |
| `/register` | 새 묶음 등록 | 필요 |

필터는 쿼리스트링에 들어갑니다. `/bundles?category=denim&status=available`
처럼 주소를 그대로 공유할 수 있습니다. 예전 `/auctions` 주소는 `/bundles` 로
자동으로 넘어갑니다.

## 구조

```
src/
├── config.ts       서비스 이름·연락처·판매 기본값
├── data/
│   ├── types.ts      Lot 타입. 등록 양식과 DB가 함께 쓰는 기준
│   ├── lots.ts       개당 단가·할인율 계산 함수
│   ├── categories.ts 카테고리 8개와 부문 4개
│   └── content.ts    거래 설명·약속·FAQ 문구
├── lib/
│   ├── store.ts      저장소 인터페이스. 서버/연습 모드를 골라 준다
│   ├── supabase.ts   Supabase 연결. 키가 없으면 null
│   ├── supabaseStore.ts  실제 서버 저장소 + 사진·영상 업로드
│   ├── localStore.ts     연습 모드 저장소 (IndexedDB)
│   ├── auth.ts       판매자 로그인
│   └── useLots.ts    화면에서 쓰는 데이터 훅
├── sections/       홈 섹션. 순서는 pages/Home.tsx에서 조립
├── components/     여러 페이지가 함께 쓰는 것들
└── pages/          라우트 단위 화면
```

화면 코드는 서버를 쓰는지 연습 모드인지 신경 쓰지 않습니다. `store` 하나만
보면 되고, 어느 쪽을 쓸지는 `.env` 에 키가 있는지로 결정됩니다.

## 아직 화면뿐인 것

- **구매 신청** — `src/pages/BundleDetail.tsx` 의 버튼이 메일 앱을 엽니다.
  실제로 돈이 오가려면 구매자 계정과 결제가 필요합니다.
- **소매업체 가입** — `/signup` 은 안내와 알림 신청까지입니다. 계정 체계가
  아직 없습니다.
- **찜하기** — 하트 버튼이 화면 안에서만 켜집니다. 저장되지 않습니다.
- **알림 신청** — 메일 앱을 엽니다. `src/components/NotifyForm.tsx`

## 기술 스택

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · React Router 7 · Supabase

폰트는 Pretendard를 CDN으로 불러옵니다. 색과 간격 토큰은 `src/index.css` 의
`@theme` 블록에 모여 있습니다.
