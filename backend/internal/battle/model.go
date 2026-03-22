package battle

import "time"

type BattleType string
type BattleStatus string

const (
	TypeCharacter BattleType = "CHARACTER" // 1v1 캐릭터 대전
	TypeFaction   BattleType = "FACTION"   // 세력 전쟁
	TypeCollab    BattleType = "COLLAB"    // 콜라보/공연 대결
	TypeStory     BattleType = "STORY"     // 스토리 분기 투표

	StatusOpen      BattleStatus = "OPEN"
	StatusClosed    BattleStatus = "CLOSED"
	StatusProducing BattleStatus = "PRODUCING"
	StatusCompleted BattleStatus = "COMPLETED"
)

type Battle struct {
	ID          string       `gorm:"primaryKey;type:varchar(36)" json:"id"`
	Title       string       `gorm:"not null" json:"title"`
	Description string       `gorm:"type:text" json:"description"`
	Type        BattleType   `gorm:"not null" json:"type"`
	Status      BattleStatus `gorm:"default:'OPEN'" json:"status"`
	SideAName   string       `gorm:"not null" json:"sideAName"`
	SideBName   string       `gorm:"not null" json:"sideBName"`
	SideAStake  int64        `gorm:"default:0" json:"sideAStake"`
	SideBStake  int64        `gorm:"default:0" json:"sideBStake"`
	WinningSide string       `json:"winningSide,omitempty"` // A | B
	VideoURL    string       `json:"videoUrl,omitempty"`
	VideoQuality string      `json:"videoQuality"`
	EndsAt      *time.Time   `json:"endsAt"`
	CreatedAt   time.Time    `json:"createdAt"`
	UpdatedAt   time.Time    `json:"updatedAt"`

	Stakes []BattleStake `gorm:"foreignKey:BattleID" json:"stakes,omitempty"`
}

type BattleStake struct {
	ID       string    `gorm:"primaryKey;type:varchar(36)" json:"id"`
	BattleID string    `gorm:"not null;index" json:"battleId"`
	UserID   string    `gorm:"not null" json:"userId"`
	Side     string    `gorm:"not null" json:"side"` // A | B
	Amount   int64     `gorm:"not null" json:"amount"`
	Rewarded bool      `gorm:"default:false" json:"rewarded"`
	CreatedAt time.Time `json:"createdAt"`
	Username string    `gorm:"-" json:"username,omitempty"`
}

type StakeRequest struct {
	Side   string `json:"side" binding:"required,oneof=A B"`
	Amount int64  `json:"amount" binding:"required,min=100"`
}

type ListResponse struct {
	Data     []Battle `json:"data"`
	Total    int64    `json:"total"`
	Page     int      `json:"page"`
	PageSize int      `json:"pageSize"`
}

// VideoQuality returns quality tier based on total staked LORE
func VideoQuality(total int64) string {
	switch {
	case total >= 200000:
		return "4K+"
	case total >= 50000:
		return "4K"
	case total >= 10000:
		return "HD"
	default:
		return "SD"
	}
}
