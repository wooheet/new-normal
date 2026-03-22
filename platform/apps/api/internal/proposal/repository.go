package proposal

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

func (r *Repository) List(status string, page, pageSize int) ([]Proposal, int64, error) {
	q := r.db.Model(&Proposal{})
	if status != "" {
		q = q.Where("status = ?", status)
	}
	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	offset := (page - 1) * pageSize
	var proposals []Proposal
	err := q.Order("created_at desc").Offset(offset).Limit(pageSize).Find(&proposals).Error
	return proposals, total, err
}

func (r *Repository) FindByID(id string) (*Proposal, error) {
	var p Proposal
	err := r.db.Preload("Votes").Preload("Comments").First(&p, "id = ?", id).Error
	return &p, err
}

func (r *Repository) Create(p *Proposal) error {
	return r.db.Create(p).Error
}

func (r *Repository) Update(p *Proposal) error {
	return r.db.Save(p).Error
}

// LastLIPNumber returns the highest LIP number in use, or 0 if none exist.
func (r *Repository) LastLIPNumber() (int, error) {
	var p Proposal
	err := r.db.Order("lip_number desc").First(&p).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return 0, nil
		}
		return 0, err
	}
	return p.LIPNumber, nil
}

func (r *Repository) CreateVote(v *Vote) error {
	return r.db.Create(v).Error
}

func (r *Repository) FindVote(proposalID, userID string) (*Vote, error) {
	var v Vote
	err := r.db.Where("proposal_id = ? AND user_id = ?", proposalID, userID).First(&v).Error
	return &v, err
}

func (r *Repository) CreateComment(c *Comment) error {
	return r.db.Create(c).Error
}

// AuthorsByIDs returns a map[userID]AuthorInfo for the given ids (batch fetch).
func (r *Repository) AuthorsByIDs(ids []string) (map[string]AuthorInfo, error) {
	type row struct {
		ID       string
		Username string
		Avatar   string
	}
	var rows []row
	if err := r.db.Table("users").Select("id, username, avatar").Where("id IN ?", ids).Find(&rows).Error; err != nil {
		return nil, err
	}
	m := make(map[string]AuthorInfo, len(rows))
	for _, r := range rows {
		m[r.ID] = AuthorInfo{ID: r.ID, Username: r.Username, Avatar: r.Avatar}
	}
	return m, nil
}
