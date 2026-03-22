package universe

import (
	"errors"
	"strings"

	pkgid "github.com/otr-universe/api/pkg/id"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Create(ownerID string, req CreateRequest) (*Universe, error) {
	slug := strings.ToLower(req.Slug)
	if s.repo.ExistsBySlug(slug) {
		return nil, errors.New("universe slug already taken")
	}
	contentTypes := req.ContentTypes
	if contentTypes == "" {
		contentTypes = "video"
	}
	threshold := req.GovernanceThreshold
	if threshold <= 0 || threshold > 1 {
		threshold = 0.51
	}
	u := &Universe{
		ID:                  pkgid.New(),
		Slug:                slug,
		Name:                req.Name,
		Description:         req.Description,
		OwnerID:             ownerID,
		Tier0Rules:          req.Tier0Rules,
		ContentTypes:        contentTypes,
		GovernanceThreshold: threshold,
		IsAdultAllowed:      req.IsAdultAllowed,
		IsPublic:            true,
		LogoURL:             req.LogoURL,
	}
	if err := s.repo.Create(u); err != nil {
		return nil, err
	}
	return u, nil
}

func (s *Service) List(page, pageSize int) (*ListResponse, error) {
	list, total, err := s.repo.List(page, pageSize)
	if err != nil {
		return nil, err
	}
	return &ListResponse{Data: list, Total: total, Page: page, PageSize: pageSize}, nil
}

func (s *Service) GetBySlug(slug string) (*Universe, error) {
	return s.repo.FindBySlug(slug)
}
