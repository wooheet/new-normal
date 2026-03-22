package universe

import (
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(dbConn *gorm.DB) *Repository {
	return &Repository{db: dbConn}
}

func (r *Repository) Create(u *Universe) error {
	return r.db.Create(u).Error
}

func (r *Repository) List(page, pageSize int) ([]Universe, int64, error) {
	var total int64
	if err := r.db.Model(&Universe{}).Where("is_public = true").Count(&total).Error; err != nil {
		return nil, 0, err
	}
	offset := (page - 1) * pageSize
	var list []Universe
	err := r.db.Where("is_public = true").
		Order("created_at desc").
		Offset(offset).Limit(pageSize).
		Find(&list).Error
	return list, total, err
}

func (r *Repository) FindBySlug(slug string) (*Universe, error) {
	var u Universe
	err := r.db.Where("slug = ?", slug).First(&u).Error
	return &u, err
}

func (r *Repository) FindByID(id string) (*Universe, error) {
	var u Universe
	err := r.db.First(&u, "id = ?", id).Error
	return &u, err
}

func (r *Repository) ExistsBySlug(slug string) bool {
	var count int64
	r.db.Model(&Universe{}).Where("slug = ?", slug).Count(&count)
	return count > 0
}
