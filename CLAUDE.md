# CLAUDE.md — OTR Universe 개발 가이드

이 파일은 OTR Universe 프로젝트에서 Claude Code가 작업할 때 참조하는 가이드입니다.

---

## 프로젝트 성격

이 프로젝트는 소프트웨어 코드베이스가 아닌 **세계관 설계 + DAO 시스템 설계 문서** 프로젝트입니다.
주요 산출물은 마크다운 문서, 거버넌스 사양서, 스마트 컨트랙트 설계입니다.

---

## 디렉토리 역할

| 경로 | 역할 | 수정 권한 |
|------|------|-----------|
| `lore/core/` | Tier 0 핵심 세계관. 절대 불변 설정 | 창립팀만 |
| `lore/canon/` | Tier 1-2 공인 설정. DAO 승인 후 편입 | DAO 투표 |
| `lore/otr/` | Tier 3 외전 설정 | DAO 투표 |
| `docs/` | 시스템 설계 문서 | 개발팀 |
| `governance/proposals/` | 제안서 아카이브 | 누구나 제출 |
| `governance/votes/` | 투표 결과 기록 | 자동 기록 |

---

## 문서 작성 원칙

### Lore 문서 작성 시
- 항상 파일 상단에 Tier 레벨을 명시: `<!-- TIER: 0 | 1 | 2 | 3 -->`
- Canon 간 모순이 없는지 `lore/core/` 먼저 확인 후 작성
- 확장 가능한 설정과 불변 설정을 명확히 구분하여 표기

### 거버넌스 문서 작성 시
- 수치(투표 threshold, 기간 등)는 반드시 근거와 함께 기록
- 변경 이력을 문서 하단에 `## 변경 이력` 섹션으로 유지

### 제안서(Proposal) 작성 시
- `governance/proposals/` 안의 `TEMPLATE.md`를 반드시 사용
- 파일명 규칙: `LIP-{번호}-{제목-kebab-case}.md` (Lore Improvement Proposal)

---

## 핵심 용어 정의

| 용어 | 정의 |
|------|------|
| Canon | DAO가 공식 승인한 세계관 설정 |
| OTR | Off The Record. 외전/스핀오프 콘텐츠 |
| LIP | Lore Improvement Proposal. 세계관 확장 제안서 |
| LORE | 거버넌스 토큰 이름 |
| Lorekeeper | Tier 3 멤버십. 제안 가중치 보유자 |
| Quorum | 투표 성립을 위한 최소 참여율 |

---

## 세계관 확장 체크리스트

새로운 Lore를 추가하거나 Claude에게 세계관 확장을 요청할 때 확인 사항:

- [ ] `lore/core/`의 핵심 설정과 모순되지 않는가?
- [ ] 확장하려는 Tier 레벨이 명확한가?
- [ ] 해당 Tier의 투표 threshold를 충족할 수 있는가?
- [ ] 기존 Canon 캐릭터/장소/사건과 연결점이 있는가?
- [ ] 미래 확장 여지를 남기고 있는가? (설정이 너무 닫혀 있지 않은지)

---

## 개발 Phase별 기술 스택

### Phase 1 (현재)
- 문서: Markdown + GitHub
- 커뮤니티: Discord
- 투표: Snapshot (오프체인, 무료)

### Phase 2
- 프론트엔드: Next.js + TypeScript
- 백엔드: Node.js (Express) or FastAPI
- DB: PostgreSQL (Lore DB) + IPFS (불변 아카이브)
- 거버넌스: Snapshot → Tally

### Phase 3
- 스마트 컨트랙트: Solidity (ERC-20 LORE 토큰, Governor 컨트랙트)
- 체인: Ethereum L2 (Optimism or Base — 낮은 가스비)
- 프론트엔드: wagmi + viem 연동
