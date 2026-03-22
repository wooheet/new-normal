package seed

import (
	"log/slog"
	"time"

	"gorm.io/gorm"

	"github.com/otr-universe/api/internal/lore"
	"github.com/otr-universe/api/internal/universe"
	"github.com/otr-universe/api/internal/video"
	pkgid "github.com/otr-universe/api/pkg/id"
)

// DemoData inserts demo Universes + lore entries + completed video jobs.
// Idempotent — safe to call multiple times.
func DemoData(db *gorm.DB) error {
	// ── Universe 1: OTR Creative (platform's own — OP×DB crossover) ────────────
	otrUniverse, err := ensureUniverse(db, &universe.Universe{
		ID:                  pkgid.New(),
		Slug:                "otr-universe",
		Name:                "OTR Universe",
		Description:         "The flagship creative universe. Home of the Dragon Straw Hat War and beyond.",
		OwnerID:             "system",
		Tier0Rules:          otrTier0Rules,
		ContentTypes:        "video",
		GovernanceThreshold: 0.51,
		IsPublic:            true,
	})
	if err != nil {
		return err
	}

	// ── Lore: OP×DB crossover ──────────────────────────────────────────────────
	if err := ensureLore(db, &lore.Entry{
		ID:         pkgid.New(),
		UniverseID: otrUniverse.ID,
		Title:      "드래곤 밀짚모자 전쟁 (Dragon Straw Hat War)",
		Summary:    "기어 5 루피와 울트라 본능 오공이 크로스포인트에서 조우, 공허의 군주 모비우스를 연합 봉인한 사건.",
		Content:    opXDbContent,
		Tier:       lore.TierConfirmed,
		Category:   lore.CategoryTimeline,
		Tags:       "crossover,one-piece,dragon-ball,crosspoint,LIP-001",
		AuthorName: "OTR 창립팀",
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}); err != nil {
		return err
	}

	// ── Video: OP×DB completed ─────────────────────────────────────────────────
	if err := ensureVideo(db, &video.VideoJob{
		ID:           pkgid.New(),
		UniverseID:   otrUniverse.ID,
		Title:        "드래곤 밀짚모자 전쟁 — 태양의 의지 (AI 생성 영상)",
		ContentType:  video.ContentLore,
		Prompt:       "Epic anime battle: Monkey D. Luffy Gear 5 and Son Goku Ultra Instinct fighting together against a void entity at a cosmic crosspoint. Cinematic, dynamic camera, vibrant color grading.",
		Status:       video.StatusCompleted,
		Quality:      "4K",
		TotalStake:   75000,
		VideoURL:     "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		ThumbnailURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
		Duration:     15,
		RequesterID:  "system",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}); err != nil {
		return err
	}

	// ── Universe 2: MapleStory (Nexon B2B example) ─────────────────────────────
	msUniverse, err := ensureUniverse(db, &universe.Universe{
		ID:                  pkgid.New(),
		Slug:                "maplestory",
		Name:                "MapleStory Universe",
		Description:         "넥슨 메이플스토리 IP 기반 커뮤니티 콘텐츠 생산 유니버스. PvP 시나리오, 직업 배틀, 신규 맵 제안.",
		OwnerID:             "system",
		Tier0Rules:          mapleTier0Rules,
		ContentTypes:        "video,game_asset",
		GovernanceThreshold: 0.60,
		IsPublic:            true,
		LogoURL:             "https://avatar.iran.liara.run/public/boy?username=maplestory",
	})
	if err != nil {
		return err
	}

	// ── Lore: MapleStory PvP Arena ─────────────────────────────────────────────
	if err := ensureLore(db, &lore.Entry{
		ID:         pkgid.New(),
		UniverseID: msUniverse.ID,
		Title:      "그란디스 PvP 콜로세움 (Grandis PvP Colosseum)",
		Summary:    "보스 처치 이외의 플레이어 간 전투를 공식화한 최초의 그란디스 콜로세움 이벤트 설정.",
		Content:    mapleLoreContent,
		Tier:       lore.TierExtended,
		Category:   lore.CategoryTimeline,
		Tags:       "pvp,colosseum,grandis,maple-world,battle-arena",
		AuthorName: "MapleStory 커뮤니티",
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}); err != nil {
		return err
	}

	// ── Video: MapleStory PvP queued (simulates community request) ────────────
	if err := ensureVideo(db, &video.VideoJob{
		ID:           pkgid.New(),
		UniverseID:   msUniverse.ID,
		Title:        "메이플스토리 PvP — 아란 vs 배틀메이지 최강자 결전",
		ContentType:  video.ContentBattle,
		Prompt:       "MapleStory 2D action: Aran (warrior with polearm) vs Battle Mage (dark mage) in a PvP colosseum arena. Pixel-art anime style, skill effects, dramatic finish.",
		Status:       video.StatusCompleted,
		Quality:      "HD",
		TotalStake:   25000,
		VideoURL:     "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
		ThumbnailURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
		Duration:     15,
		RequesterID:  "system",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}); err != nil {
		return err
	}

	slog.Info("seed: all demo data ready")
	return nil
}

// ── helpers ────────────────────────────────────────────────────────────────────

func ensureUniverse(db *gorm.DB, u *universe.Universe) (*universe.Universe, error) {
	var existing universe.Universe
	if err := db.Where("slug = ?", u.Slug).First(&existing).Error; err == nil {
		slog.Info("seed: universe already exists", "slug", u.Slug)
		return &existing, nil
	}
	if err := db.Create(u).Error; err != nil {
		return nil, err
	}
	slog.Info("seed: universe created", "slug", u.Slug)
	return u, nil
}

func ensureLore(db *gorm.DB, e *lore.Entry) error {
	var count int64
	db.Model(&lore.Entry{}).Where("title = ? AND universe_id = ?", e.Title, e.UniverseID).Count(&count)
	if count > 0 {
		slog.Info("seed: lore entry already exists", "title", e.Title)
		return nil
	}
	if err := db.Create(e).Error; err != nil {
		return err
	}
	slog.Info("seed: lore entry created", "title", e.Title)
	return nil
}

func ensureVideo(db *gorm.DB, j *video.VideoJob) error {
	var count int64
	db.Model(&video.VideoJob{}).Where("title = ? AND universe_id = ?", j.Title, j.UniverseID).Count(&count)
	if count > 0 {
		slog.Info("seed: video job already exists", "title", j.Title)
		return nil
	}
	if err := db.Create(j).Error; err != nil {
		return err
	}
	slog.Info("seed: video job created", "title", j.Title)
	return nil
}

// ── seed content ───────────────────────────────────────────────────────────────

const otrTier0Rules = `## OTR Universe — Tier 0 Rules

1. 크로스포인트 이벤트를 통한 세계선 교차만 허용
2. 인과율 역전 불가 (과거 변경 시나리오 금지)
3. 동일 세계선에서 온 두 동일 존재의 동시 공존 불가`

const opXDbContent = `# 드래곤 밀짚모자 전쟁

기어 5 해방으로 방출된 Joy Boy 에너지가 손오공의 울트라 본능 기(氣)와
주파수 공명을 일으키며 크로스포인트 CP-001이 열렸다.

루피와 오공은 처음 서로를 적으로 오해해 짧은 교전을 벌였으나,
공허의 군주 **모비우스**의 존재를 확인한 후 즉시 연합 체제를 구성.

합동 필살기 **"태양의 의지(Will of the Sun)"** 로 모비우스 봉인 성공.`

const mapleTier0Rules = `## MapleStory Universe — Tier 0 Rules (Nexon 정의)

1. 메이플 세계 및 그란디스 세계의 지리/역사는 공식 설정을 따른다
2. 직업 스킬 및 능력치는 현행 게임 밸런스 기준을 위반하지 않는다
3. 주요 NPC(영웅, 신수 등)의 사망 또는 영구적 설정 변경 시나리오는 Tier 0 위반
4. 메이플 IP를 사용한 성인 전용 콘텐츠 금지`

const mapleLoreContent = `# 그란디스 PvP 콜로세움

## 배경

리부트 이후 안정된 그란디스에서 각 종족 간 우호적 경쟁을 위해
**그란디스 PvP 콜로세움**이 설립되었다.

## 규칙

- 참가 제한: Lv.260 이상
- 직업군별 토너먼트 방식 (전사계 / 마법사계 / 궁수계 / 도적계 / 해적계)
- 콜로세움 내에서의 사망은 리스폰 처리 (영구 사망 없음)
- 우승자에게 **그란디스 영웅 칭호** 부여

## 첫 번째 챔피언십

**아란(Aran) vs 배틀메이지(Battle Mage)** 결승전이 가장 화제가 된 매치업.
아란의 폴암 연속기 vs 배틀메이지의 다크 에너지 — 커뮤니티 투표 75% 찬성으로 영상 제작 승인.`
