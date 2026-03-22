package lore

import "time"

type Tier int

const (
	TierCore      Tier = 0
	TierConfirmed Tier = 1
	TierExtended  Tier = 2
	TierOTR       Tier = 3
	TierFan       Tier = 4
)

type Category string

const (
	CategoryTimeline  Category = "TIMELINE"
	CategoryGeography Category = "GEOGRAPHY"
	CategoryFaction   Category = "FACTION"
	CategoryCharacter Category = "CHARACTER"
	CategoryWorldRule Category = "WORLD_RULE"
	CategoryArtifact  Category = "ARTIFACT"
)

type Entry struct {
	ID         string   `gorm:"primaryKey;type:varchar(36)" json:"id"`
	UniverseID string   `gorm:"type:varchar(36);index" json:"universeId"` // "" = platform-level
	Title      string   `gorm:"not null" json:"title"`
	Summary    string   `gorm:"not null" json:"summary"`
	Content    string   `gorm:"type:text" json:"content"`
	Tier       Tier     `gorm:"not null" json:"tier"`
	Category   Category `gorm:"not null" json:"category"`
	Tags       string   `json:"tags"` // comma-separated
	AuthorName string   `json:"authorName"`
	ProposalID string   `json:"proposalId,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

type ListParams struct {
	UniverseID string
	Tier       *int
	Category   string
	Search     string
	Page       int
	PageSize   int
}

type ListResponse struct {
	Data     []Entry `json:"data"`
	Total    int64   `json:"total"`
	Page     int     `json:"page"`
	PageSize int     `json:"pageSize"`
}
