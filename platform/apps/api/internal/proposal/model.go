package proposal

import (
	"time"

	"gorm.io/gorm"
)

type Type string
type Status string

const (
	TypeA Type = "A"
	TypeB Type = "B"
	TypeC Type = "C"
	TypeD Type = "D"
)

const (
	StatusDraft      Status = "DRAFT"
	StatusReview     Status = "REVIEW"
	StatusDiscussion Status = "DISCUSSION"
	StatusVoting     Status = "VOTING"
	StatusApproved   Status = "APPROVED"
	StatusRejected   Status = "REJECTED"
	StatusArchived   Status = "ARCHIVED"
)

type Proposal struct {
	ID                string         `gorm:"primaryKey;type:varchar(36)"           json:"id"`
	LIPNumber         int            `gorm:"column:lip_number;uniqueIndex;not null" json:"lipNumber"`
	Title             string         `gorm:"not null"                              json:"title"`
	Summary           string         `gorm:"not null"                              json:"summary"`
	Content           string         `gorm:"type:text"                             json:"content"`
	Type              Type           `gorm:"not null"                              json:"type"`
	TargetTier        int            `gorm:"not null"                              json:"targetTier"`
	Category          string         `gorm:"not null"                              json:"category"`
	Status            Status         `gorm:"default:'DRAFT'"                       json:"status"`
	StakingAmount     int64          `gorm:"default:0"                             json:"stakingAmount"`
	QuorumRequired    float64        `json:"quorumRequired"`
	ThresholdRequired float64        `json:"thresholdRequired"`
	DiscussionEndsAt  *time.Time     `json:"discussionEndsAt"`
	VotingEndsAt      *time.Time     `json:"votingEndsAt"`
	AuthorID          string         `gorm:"not null"                              json:"authorId"`
	LoreEntryID       string         `json:"loreEntryId,omitempty"`
	CreatedAt         time.Time      `json:"createdAt"`
	UpdatedAt         time.Time      `json:"updatedAt"`
	DeletedAt         gorm.DeletedAt `gorm:"index"                                 json:"-"`

	Author   *AuthorInfo `gorm:"-" json:"author,omitempty"`
	Votes    []Vote      `gorm:"foreignKey:ProposalID" json:"votes,omitempty"`
	Comments []Comment   `gorm:"foreignKey:ProposalID" json:"comments,omitempty"`
}

type AuthorInfo struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Avatar   string `json:"avatar"`
}

type Vote struct {
	ID         string    `gorm:"primaryKey;type:varchar(36)"                         json:"id"`
	ProposalID string    `gorm:"not null;uniqueIndex:idx_proposal_user;type:varchar(36)" json:"proposalId"`
	UserID     string    `gorm:"not null;uniqueIndex:idx_proposal_user"               json:"userId"`
	Choice     string    `gorm:"not null"                                            json:"choice"` // FOR | AGAINST | ABSTAIN
	Weight     int       `gorm:"default:1"                                           json:"weight"`
	CreatedAt  time.Time `json:"createdAt"`
	Username   string    `gorm:"-" json:"username,omitempty"`
}

type Comment struct {
	ID         string      `gorm:"primaryKey;type:varchar(36)" json:"id"`
	ProposalID string      `gorm:"not null;index;type:varchar(36)" json:"proposalId"`
	AuthorID   string      `gorm:"not null"                    json:"authorId"`
	Content    string      `gorm:"not null"                    json:"content"`
	CreatedAt  time.Time   `json:"createdAt"`
	UpdatedAt  time.Time   `json:"updatedAt"`
	Author     *AuthorInfo `gorm:"-" json:"author,omitempty"`
}

type CreateRequest struct {
	Title      string `json:"title"      binding:"required,min=5,max=200"`
	Summary    string `json:"summary"    binding:"required,min=20,max=500"`
	Content    string `json:"content"    binding:"required,min=100"`
	Type       Type   `json:"type"       binding:"required,oneof=A B C D"`
	TargetTier int    `json:"targetTier" binding:"required,min=1,max=3"`
	Category   string `json:"category"   binding:"required"`
}

type VoteRequest struct {
	Choice string `json:"choice" binding:"required,oneof=FOR AGAINST ABSTAIN"`
}

type CommentRequest struct {
	Content string `json:"content" binding:"required,min=2"`
}

type ListResponse struct {
	Data     []Proposal `json:"data"`
	Total    int64      `json:"total"`
	Page     int        `json:"page"`
	PageSize int        `json:"pageSize"`
}

type Thresholds struct {
	Quorum     float64
	Threshold  float64
	Staking    int64
	Discussion int
	Voting     int
}

func GetThresholds(t Type, tier int) Thresholds {
	switch t {
	case TypeA:
		switch tier {
		case 1:
			return Thresholds{0.15, 0.75, 5000, 7, 7}
		case 2:
			return Thresholds{0.10, 0.60, 1000, 5, 5}
		default:
			return Thresholds{0.05, 0.50, 500, 3, 3}
		}
	case TypeB:
		if tier == 1 {
			return Thresholds{0.20, 0.75, 10000, 10, 7}
		}
		return Thresholds{0.12, 0.65, 3000, 7, 5}
	case TypeC:
		if tier == 1 {
			return Thresholds{0.10, 0.60, 2000, 5, 5}
		}
		return Thresholds{0.25, 0.80, 20000, 7, 7}
	case TypeD:
		return Thresholds{0.30, 0.80, 50000, 14, 10}
	default:
		return Thresholds{0.05, 0.50, 500, 3, 3}
	}
}
