package video

import (
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(dbConn *gorm.DB) *Repository {
	return &Repository{db: dbConn}
}

func (r *Repository) List(universeID, contentType string, page, pageSize int, includeAdult bool) ([]VideoJob, int64, error) {
	q := r.db.Model(&VideoJob{})
	if universeID != "" {
		q = q.Where("universe_id = ?", universeID)
	}
	if contentType != "" {
		q = q.Where("content_type = ?", contentType)
	}
	if !includeAdult {
		q = q.Where("is_adult_only = false")
	}

	var total int64
	q.Count(&total)

	offset := (page - 1) * pageSize
	var jobs []VideoJob
	err := q.Order("created_at desc").Offset(offset).Limit(pageSize).Find(&jobs).Error
	return jobs, total, err
}

func (r *Repository) FindByID(id string) (*VideoJob, error) {
	var j VideoJob
	err := r.db.First(&j, "id = ?", id).Error
	return &j, err
}

func (r *Repository) Create(j *VideoJob) error {
	return r.db.Create(j).Error
}

func (r *Repository) UpdateStatus(id string, status VideoStatus, videoURL, thumbnailURL string, duration int) error {
	return r.db.Model(&VideoJob{}).Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":        status,
			"video_url":     videoURL,
			"thumbnail_url": thumbnailURL,
			"duration":      duration,
		}).Error
}
