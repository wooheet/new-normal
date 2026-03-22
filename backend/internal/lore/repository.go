package lore

import (
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(dbConn *gorm.DB) *Repository {
	return &Repository{db: dbConn}
}

func (r *Repository) List(p ListParams) ([]Entry, int64, error) {
	q := r.db.Model(&Entry{})
	if p.UniverseID != "" {
		q = q.Where("universe_id = ?", p.UniverseID)
	}
	if p.Tier != nil {
		q = q.Where("tier = ?", *p.Tier)
	}
	if p.Category != "" {
		q = q.Where("category = ?", p.Category)
	}
	if p.Search != "" {
		like := "%" + p.Search + "%"
		q = q.Where("title ILIKE ? OR summary ILIKE ? OR tags ILIKE ?", like, like, like)
	}

	var total int64
	q.Count(&total)

	offset := (p.Page - 1) * p.PageSize
	var entries []Entry
	err := q.Order("created_at desc").Offset(offset).Limit(p.PageSize).Find(&entries).Error
	return entries, total, err
}

func (r *Repository) FindByID(id string) (*Entry, error) {
	var e Entry
	err := r.db.First(&e, "id = ?", id).Error
	return &e, err
}

func (r *Repository) Create(e *Entry) error {
	return r.db.Create(e).Error
}
