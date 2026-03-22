# 개발 로드맵 — OTR Universe

---

## Phase 0: Genesis (0~1개월)
> 핵심 세계관을 정의하고 커뮤니티의 씨앗을 심는 단계

### 목표
- [ ] Core Canon (Tier 0) 설정 확정 및 문서화
- [ ] 첫 OTR 영상 제작 및 공개
- [ ] Discord 커뮤니티 서버 오픈
- [ ] GitHub Lore Wiki 공개 (읽기 전용)
- [ ] 포인트 기반 임시 거버넌스 시스템 구축

### 산출물
- `lore/core/` 디렉토리 내 핵심 설정 문서 완성
- Discord 채널 구조: #lore-discussion, #proposals, #voting, #otr-content
- 첫 번째 LIP 템플릿 공개

### 성공 지표
- Discord 멤버 1,000명
- 첫 영상 조회수 10,000+
- 커뮤니티 자발적 Lore 토론 발생

---

## Phase 1: Community (1~3개월)
> 커뮤니티가 세계관을 처음으로 확장하는 단계

### 목표
- [ ] 첫 번째 LIP 제안 접수 및 투표 진행
- [ ] 커뮤니티 제안 세계관을 영상으로 제작
- [ ] Lore Wiki 인터랙티브 타임라인 구축
- [ ] Snapshot 거버넌스 연동
- [ ] Lorekeeper Council 첫 선출

### 산출물
- 첫 커뮤니티 제안 영상 (Tier 3 OTR)
- Lore Explorer 웹페이지 v0.1 (타임라인, 캐릭터 목록)
- Snapshot Space 개설: `otr-universe.eth`

### 성공 지표
- Discord 멤버 5,000명
- LIP 제안 10건 이상
- 거버넌스 투표 참여율 20%+

---

## Phase 2: Token Launch (3~6개월)
> LORE 토큰 발행 및 본격적인 DAO 운영 시작

### 목표
- [ ] LORE ERC-20 토큰 스마트 컨트랙트 배포 (Ethereum L2)
- [ ] 토큰 배분 실행 (얼리 컨트리뷰터, 리워드 풀 오픈)
- [ ] 전용 플랫폼 웹사이트 v1.0 런칭
- [ ] 멤버십 티어 시스템 구현
- [ ] Treasury 멀티시그 지갑 설정
- [ ] 첫 Treasury 지출 제안 (제작비 지원)

### 산출물
- LORE 토큰 컨트랙트 (감사 완료)
- OTR Universe 플랫폼 (Lore Explorer + 거버넌스 대시보드)
- 첫 커뮤니티 Treasury 펀딩 영상

### 기술 스택
```
Frontend: Next.js 14 + TypeScript + TailwindCSS
Backend:  Node.js (Express) + PostgreSQL
Web3:     wagmi + viem + WalletConnect
Chain:    Optimism or Base (낮은 가스비)
Storage:  IPFS (Lore 문서 불변 아카이브)
```

### 성공 지표
- LORE 토큰 홀더 2,000명+
- 거버넌스 투표 참여율 30%+
- Treasury TVL $50,000+

---

## Phase 3: Full DAO (6개월+)
> 완전한 탈중앙화 DAO로 전환

### 목표
- [ ] 온체인 Governor 컨트랙트 배포 (OpenZeppelin Governor)
- [ ] 투표 통과 시 Lore DB 자동 업데이트 (온체인 → 오프체인 브리지)
- [ ] 쿼드라틱 투표 도입
- [ ] 외부 크리에이터 오픈 (누구나 OTR 제작 후 Canon 편입 신청)
- [ ] 커뮤니티 캐릭터 NFT 발행
- [ ] IP 확장 거버넌스 (굿즈, 게임, 소설 라이선스)

### 산출물
- 온체인 거버넌스 시스템 완성
- 캐릭터 NFT 컨트랙트 (ERC-721)
- 외부 크리에이터 온보딩 가이드
- IP 라이선스 프레임워크

### 성공 지표
- LORE 토큰 홀더 10,000명+
- 외부 크리에이터 제작 OTR 월 5편+
- Treasury TVL $500,000+

---

## 기술 아키텍처 진화

```
Phase 1                Phase 2                Phase 3
─────────             ─────────             ─────────
Discord              웹 플랫폼              풀 DApp
Snapshot             Snapshot+Tally         온체인 Governor
포인트 시스템         ERC-20 LORE           LORE + NFT
GitHub Wiki          PostgreSQL+IPFS        IPFS 완전 탈중앙
수동 집행            멀티시그 Treasury      자동화 Treasury
```

---

## 콘텐츠 로드맵

```
Month 1:  첫 OTR 영상 (세계관 소개, 핵심 인물)
Month 2:  Lore Drop #1 (세계관 설정 영상)
Month 3:  첫 커뮤니티 제안 OTR 영상
Month 4:  Canon Tier 1 메인 에피소드 #1
Month 5:  Lore Drop #2 + 두 번째 커뮤니티 OTR
Month 6:  중간 결산 — Phase 2 전환 기념 특집
```
