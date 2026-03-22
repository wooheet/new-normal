package user

import (
	"time"

	"gorm.io/gorm"
)

type MembershipTier string

const (
	TierObserver    MembershipTier = "OBSERVER"
	TierContributor MembershipTier = "CONTRIBUTOR"
	TierLorekeeper  MembershipTier = "LOREKEEPER"
	TierFounder     MembershipTier = "FOUNDER"
	TierAdult       MembershipTier = "ADULT"
)

type User struct {
	ID             string         `gorm:"primaryKey;type:varchar(36)" json:"id"`
	Username       string         `gorm:"uniqueIndex;not null" json:"username"`
	Email          string         `gorm:"uniqueIndex;not null" json:"-"`
	PasswordHash   string         `gorm:"not null" json:"-"`
	Avatar         string         `json:"avatar"`
	Bio            string         `json:"bio"`
	MembershipTier MembershipTier `gorm:"default:'OBSERVER'" json:"membershipTier"`
	LorePoints     int64          `gorm:"default:0" json:"lorePoints"`
	IsAdultVerified bool          `gorm:"default:false" json:"isAdultVerified"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=3,max=30"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type PublicUser struct {
	ID             string         `json:"id"`
	Username       string         `json:"username"`
	Avatar         string         `json:"avatar"`
	Bio            string         `json:"bio"`
	MembershipTier MembershipTier `json:"membershipTier"`
	LorePoints     int64          `json:"lorePoints"`
	CreatedAt      time.Time      `json:"createdAt"`
}
