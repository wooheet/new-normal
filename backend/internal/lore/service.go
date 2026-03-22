package lore

import (
	"strconv"

	pkgid "github.com/otr-universe/api/pkg/id"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) List(universeID, tier, category, search string, page, pageSize int) (*ListResponse, error) {
	p := ListParams{
		UniverseID: universeID,
		Category:   category,
		Search:     search,
		Page:       page,
		PageSize:   pageSize,
	}
	if tier != "" {
		t, err := strconv.Atoi(tier)
		if err == nil {
			p.Tier = &t
		}
	}
	entries, total, err := s.repo.List(p)
	if err != nil {
		return nil, err
	}
	return &ListResponse{Data: entries, Total: total, Page: page, PageSize: pageSize}, nil
}

func (s *Service) GetByID(id string) (*Entry, error) {
	return s.repo.FindByID(id)
}

func (s *Service) Create(e *Entry) error {
	e.ID = pkgid.New()
	return s.repo.Create(e)
}
