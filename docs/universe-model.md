# Universe Model — 멀티-IP 플랫폼 설계

## 핵심 개념

OTR Platform은 **하나의 IP를 위한 서비스가 아닙니다.**
어떤 IP든 "Universe"로 등록하면, 동일한 DAO-거버넌스 + AI 생산 인프라를 공유합니다.

```
┌─────────────────────────────────────────────────────┐
│                   OTR Platform                       │
│                                                      │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────┐ │
│  │ OTR Universe │   │  MapleStory  │   │  Any IP  │ │
│  │  (flagship)  │   │   (Nexon)    │   │  (B2B)   │ │
│  └──────┬───────┘   └──────┬───────┘   └────┬─────┘ │
│         │                  │                 │        │
│  ┌──────▼──────────────────▼─────────────────▼─────┐ │
│  │  공통 인프라: DAO 투표 / AI 파이프라인 / 토크노믹스  │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Universe 데이터 구조

| 필드 | 설명 | 예시 (MapleStory) |
|------|------|------------------|
| `slug` | 고유 식별자 | `maplestory` |
| `name` | 표시 이름 | `MapleStory Universe` |
| `ownerId` | IP 등록자 (기업 계정) | Nexon 계정 ID |
| `tier0Rules` | IP 소유자가 정의한 절대 불변 설정 | 직업 스킬, NPC 생사 금지 등 |
| `contentTypes` | 생산 가능한 콘텐츠 종류 | `video,game_asset` |
| `governanceThreshold` | 제안 통과 찬성 비율 | `0.60` (60%) |
| `isAdultAllowed` | 성인 콘텐츠 허용 여부 | `false` |

---

## B2B 케이스: 넥슨 메이플스토리 PvP 게임

### 시나리오

> "넥슨이 메이플스토리 PvP 게임을 만들고 싶은데,
>  어떤 직업 조합이 인기 있을지 커뮤니티에게 물어보고 싶다."

### 플로우

```
1. [넥슨] Universe 등록
   POST /api/universes
   {
     "slug": "maplestory",
     "tier0Rules": "직업 밸런스는 현행 게임 기준 준수...",
     "contentTypes": "video,game_asset",
     "governanceThreshold": 0.60
   }

2. [커뮤니티] Proposal 제출
   "아란 vs 배틀메이지 PvP 매치업 영상 제작" 제안
   LORE 스테이킹 25,000 → HD 품질 배정

3. [DAO 투표]
   찬성 75% → 60% threshold 통과 → 승인

4. [AI 파이프라인]
   Video Job QUEUED → PROCESSING → COMPLETED
   결과물: HD PvP 배틀 영상

5. [넥슨 활용]
   - 인기 직업 조합 데이터 수집 (커뮤니티 투표 기반)
   - 실제 PvP 게임 개발 방향성 결정
   - 커뮤니티에 영상 배포 → 게임 홍보 효과
```

### 넥슨이 얻는 것

| 혜택 | 내용 |
|------|------|
| **커뮤니티 검증** | 개발 전 어떤 PvP 매치업이 인기 있는지 DAO 투표로 검증 |
| **마케팅 자산** | AI 생성 배틀 영상 → 게임 공개 전 사전 바이럴 |
| **팬 참여** | 커뮤니티가 직접 시나리오를 설계 → 게임 출시 후 충성도 상승 |
| **토크노믹스** | LORE 스테이킹 → 커뮤니티 자체 자금으로 콘텐츠 생산 비용 분담 |

---

## 다른 B2B 케이스들

### 케이스 2: 토에이 애니메이션 — 원피스 외전

```
Universe: one-piece
Tier 0: 악마의 열매 능력, 세계관 지리, 주요 캐릭터 생사
콘텐츠: 커뮤니티가 제안한 "만약 조로가 악마의 열매를 먹었다면?"
결과: AI 외전 영상 시리즈
```

### 케이스 3: 독립 게임 개발사 — 오리지널 판타지 MMO

```
Universe: fantasy-mmo
Tier 0: 종족/클래스 설정, 세계 지리
콘텐츠: 길드 전쟁 시뮬레이션, 레이드 공략 영상, 신규 던전 시나리오
결과: 출시 전 유저 참여로 세계관 함께 설계
```

### 케이스 4: 크로스포인트 이벤트 (Universe 간 협업)

```
조건: OTR Universe × MapleStory Universe 양측 DAO 67% 찬성
결과: "메이플 영웅들이 크로스포인트를 통해 OTR Universe에 진입"
      → 양측 커뮤니티에 동시 배포
```

---

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/api/universes` | 전체 Universe 목록 |
| `GET` | `/api/universes/:slug` | Universe 상세 (Tier 0 Rules 포함) |
| `POST` | `/api/universes` | Universe 등록 (auth 필요) |
| `GET` | `/api/videos?universe=<slug_id>` | 특정 Universe의 영상만 필터 |
| `POST` | `/api/videos/request` | 특정 Universe에 영상 제작 요청 |

---

## 설계 원칙

1. **Universe 간 완전 격리** — 각 IP의 Tier 0가 충돌하지 않도록 독립 컨테이너
2. **IP 소유자 권한** — Tier 0는 오직 `ownerId` 계정만 수정 가능
3. **공통 인프라 재사용** — DAO 투표, AI 파이프라인, 토크노믹스는 모든 Universe 공유
4. **거버넌스 커스터마이즈** — Universe별로 `governanceThreshold` 독립 설정
5. **크로스포인트 = 양측 동의** — 어떤 크로스오버도 양측 IP 소유자 + DAO 동의 필수
