package user

import (
	"github.com/otr-universe/api/pkg/db"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository() *Repository {
	return &Repository{db: db.DB}
}

func (r *Repository) Create(u *User) error {
	return r.db.Create(u).Error
}

func (r *Repository) FindByEmail(email string) (*User, error) {
	var u User
	err := r.db.Where("email = ?", email).First(&u).Error
	return &u, err
}

func (r *Repository) FindByUsername(username string) (*User, error) {
	var u User
	err := r.db.Where("username = ?", username).First(&u).Error
	return &u, err
}

func (r *Repository) FindByID(id string) (*User, error) {
	var u User
	err := r.db.First(&u, "id = ?", id).Error
	return &u, err
}

func (r *Repository) UpdatePoints(id string, delta int64) error {
	return r.db.Model(&User{}).Where("id = ?", id).
		UpdateColumn("lore_points", gorm.Expr("lore_points + ?", delta)).Error
}
