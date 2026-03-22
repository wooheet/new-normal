package video

import "time"

type VideoStatus string
type ContentType string

const (
	StatusQueued     VideoStatus = "QUEUED"
	StatusProcessing VideoStatus = "PROCESSING"
	StatusCompleted  VideoStatus = "COMPLETED"
	StatusFailed     VideoStatus = "FAILED"

	ContentLore     ContentType = "LORE"
	ContentBattle   ContentType = "BATTLE"
	ContentPersonal ContentType = "PERSONAL"
	ContentAdult    ContentType = "ADULT"
)

type VideoJob struct {
	ID           string      `gorm:"primaryKey;type:varchar(36)" json:"id"`
	UniverseID   string      `gorm:"type:varchar(36);index" json:"universeId"` // "" = platform-level
	Title        string      `gorm:"not null" json:"title"`
	ContentType  ContentType `gorm:"not null" json:"contentType"`
	SourceID     string      `json:"sourceId"` // proposalID or battleID
	Prompt       string      `gorm:"type:text" json:"prompt"`
	Status       VideoStatus `gorm:"default:'QUEUED'" json:"status"`
	Quality      string      `gorm:"default:'SD'" json:"quality"` // SD|HD|4K|4K+
	TotalStake   int64       `gorm:"default:0" json:"totalStake"`
	VideoURL     string      `json:"videoUrl,omitempty"`
	ThumbnailURL string      `json:"thumbnailUrl,omitempty"`
	Duration     int         `json:"duration,omitempty"` // seconds
	RequesterID  string      `json:"requesterId"`
	IsAdultOnly  bool        `gorm:"default:false" json:"isAdultOnly"`
	CreatedAt    time.Time   `json:"createdAt"`
	UpdatedAt    time.Time   `json:"updatedAt"`
}

type ListResponse struct {
	Data     []VideoJob `json:"data"`
	Total    int64      `json:"total"`
	Page     int        `json:"page"`
	PageSize int        `json:"pageSize"`
}

type VideoRequestInput struct {
	UniverseID  string `json:"universeId"`
	Title       string `json:"title" binding:"required"`
	Prompt      string `json:"prompt" binding:"required"`
	ContentType string `json:"contentType" binding:"required,oneof=LORE BATTLE PERSONAL"`
	SourceID    string `json:"sourceId"`
	Stake       int64  `json:"stake"`
}

type CompleteInput struct {
	VideoURL     string `json:"videoUrl" binding:"required"`
	ThumbnailURL string `json:"thumbnailUrl"`
	Duration     int    `json:"duration"`
}
