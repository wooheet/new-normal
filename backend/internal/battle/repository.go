package battle

import (
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(dbConn *gorm.DB) *Repository {
	return &Repository{db: dbConn}
}

func (r *Repository) List(status string, page, pageSize int) ([]Battle, int64, error) {
	q := r.db.Model(&Battle{})
	if status != "" {
		q = q.Where("status = ?", status)
	}
	var total int64
	q.Count(&total)

	offset := (page - 1) * pageSize
	var battles []Battle
	err := q.Order("created_at desc").Offset(offset).Limit(pageSize).Find(&battles).Error
	return battles, total, err
}

func (r *Repository) FindByID(id string) (*Battle, error) {
	var b Battle
	err := r.db.Preload("Stakes").First(&b, "id = ?", id).Error
	return &b, err
}

func (r *Repository) Create(b *Battle) error {
	return r.db.Create(b).Error
}

func (r *Repository) Update(b *Battle) error {
	return r.db.Save(b).Error
}

func (r *Repository) CreateStake(s *BattleStake) error {
	return r.db.Create(s).Error
}

func (r *Repository) AddStakeToSide(battleID, side string, amount int64) error {
	field := "side_a_stake"
	if side == "B" {
		field = "side_b_stake"
	}
	return r.db.Model(&Battle{}).Where("id = ?", battleID).
		UpdateColumn(field, gorm.Expr(field+" + ?", amount)).Error
}

// UsernamesByIDs returns a map[userID]username for the given ids (batch fetch).
func (r *Repository) UsernamesByIDs(ids []string) (map[string]string, error) {
	type row struct {
		ID       string
		Username string
	}
	var rows []row
	if err := r.db.Table("users").Select("id, username").Where("id IN ?", ids).Find(&rows).Error; err != nil {
		return nil, err
	}
	m := make(map[string]string, len(rows))
	for _, row := range rows {
		m[row.ID] = row.Username
	}
	return m, nil
}
