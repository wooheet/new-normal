package universe

import "time"

// Universe is an IP container. Each company or creator registers one.
// All lore, proposals, battles, and videos belong to a Universe.
type Universe struct {
	ID                  string    `gorm:"primaryKey;type:varchar(36)" json:"id"`
	Slug                string    `gorm:"uniqueIndex;not null" json:"slug"` // e.g. "maplestory"
	Name                string    `gorm:"not null" json:"name"`
	Description         string    `gorm:"type:text" json:"description"`
	OwnerID             string    `gorm:"type:varchar(36)" json:"ownerId"` // user who registered it
	Tier0Rules          string    `gorm:"type:text" json:"tier0Rules"`     // IP owner's immutable rules (markdown)
	ContentTypes        string    `json:"contentTypes"`                    // comma-separated: video,game_asset,webtoon
	GovernanceThreshold float64   `gorm:"default:0.51" json:"governanceThreshold"`
	IsAdultAllowed      bool      `gorm:"default:false" json:"isAdultAllowed"`
	IsPublic            bool      `gorm:"default:true" json:"isPublic"`
	LogoURL             string    `json:"logoUrl,omitempty"`
	BannerURL           string    `json:"bannerUrl,omitempty"`
	CreatedAt           time.Time `json:"createdAt"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

type CreateRequest struct {
	Slug                string  `json:"slug" binding:"required,alphanum,min=2,max=50"`
	Name                string  `json:"name" binding:"required"`
	Description         string  `json:"description"`
	Tier0Rules          string  `json:"tier0Rules"`
	ContentTypes        string  `json:"contentTypes"`
	GovernanceThreshold float64 `json:"governanceThreshold"`
	IsAdultAllowed      bool    `json:"isAdultAllowed"`
	LogoURL             string  `json:"logoUrl"`
}

type ListResponse struct {
	Data     []Universe `json:"data"`
	Total    int64      `json:"total"`
	Page     int        `json:"page"`
	PageSize int        `json:"pageSize"`
}
