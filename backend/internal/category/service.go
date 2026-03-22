package category

import (
	"errors"

	"github.com/otr-universe/api/internal/user"
	pkgid "github.com/otr-universe/api/pkg/id"
)

type Service struct {
	repo     *Repository
	userRepo *user.Repository
}

func NewService(repo *Repository, userRepo *user.Repository) *Service {
	return &Service{repo: repo, userRepo: userRepo}
}

func (s *Service) ListCategories(userID string) ([]Category, error) {
	cats, err := s.repo.ListCategories()
	if err != nil {
		return nil, err
	}

	isAdultVerified := false
	if userID != "" {
		u, err := s.userRepo.FindByID(userID)
		if err == nil {
			isAdultVerified = u.IsAdultVerified
		}
	}

	if isAdultVerified {
		return cats, nil
	}
	filtered := make([]Category, 0, len(cats))
	for _, c := range cats {
		if !c.IsAdultOnly {
			filtered = append(filtered, c)
		}
	}
	return filtered, nil
}

func (s *Service) ListThreads(slug string, page, pageSize int, userID string) (*ThreadListResponse, error) {
	cat, err := s.repo.FindCategoryBySlug(slug)
	if err != nil {
		return nil, errors.New("category not found")
	}
	if cat.IsAdultOnly {
		if userID == "" {
			return nil, errors.New("adult verification required")
		}
		u, err := s.userRepo.FindByID(userID)
		if err != nil || !u.IsAdultVerified {
			return nil, errors.New("adult verification required")
		}
	}

	threads, total, err := s.repo.ListThreads(cat.ID, page, pageSize)
	if err != nil {
		return nil, err
	}
	if len(threads) == 0 {
		return &ThreadListResponse{Data: threads, Total: total, Page: page, PageSize: pageSize}, nil
	}

	// Batch-fetch author info
	authorIDs := make([]string, len(threads))
	threadIDs := make([]string, len(threads))
	for i, t := range threads {
		authorIDs[i] = t.AuthorID
		threadIDs[i] = t.ID
	}

	authors, _ := s.repo.AuthorsByIDs(authorIDs)
	replyCounts, _ := s.repo.ReplyCountsByThreadIDs(threadIDs)

	for i := range threads {
		if a, ok := authors[threads[i].AuthorID]; ok {
			threads[i].Author = &a
		}
		threads[i].ReplyCount = replyCounts[threads[i].ID]
	}

	return &ThreadListResponse{Data: threads, Total: total, Page: page, PageSize: pageSize}, nil
}

func (s *Service) GetThread(id string) (*Thread, error) {
	t, err := s.repo.FindThread(id)
	if err != nil {
		return nil, err
	}
	s.repo.IncrementViews(id)

	// Batch-fetch all authors (thread + replies) in one query
	ids := make([]string, 0, 1+len(t.Replies))
	ids = append(ids, t.AuthorID)
	for _, r := range t.Replies {
		ids = append(ids, r.AuthorID)
	}
	authors, err := s.repo.AuthorsByIDs(ids)
	if err == nil {
		if a, ok := authors[t.AuthorID]; ok {
			t.Author = &a
		}
		for i := range t.Replies {
			if a, ok := authors[t.Replies[i].AuthorID]; ok {
				t.Replies[i].Author = &a
			}
		}
	}
	return t, nil
}

func (s *Service) CreateThread(slug, authorID string, req CreateThreadRequest) (*Thread, error) {
	cat, err := s.repo.FindCategoryBySlug(slug)
	if err != nil {
		return nil, errors.New("category not found")
	}
	if cat.IsAdultOnly {
		u, err := s.userRepo.FindByID(authorID)
		if err != nil || !u.IsAdultVerified {
			return nil, errors.New("adult verification required")
		}
	}

	t := &Thread{
		ID:         pkgid.New(),
		CategoryID: cat.ID,
		AuthorID:   authorID,
		Title:      req.Title,
		Content:    req.Content,
	}
	if err := s.repo.CreateThread(t); err != nil {
		return nil, err
	}
	u, err := s.userRepo.FindByID(authorID)
	if err == nil {
		t.Author = &AuthorInfo{ID: u.ID, Username: u.Username, Avatar: u.Avatar}
	}
	return t, nil
}

func (s *Service) CreateReply(threadID, authorID, content string) (*Reply, error) {
	u, err := s.userRepo.FindByID(authorID)
	if err != nil {
		return nil, errors.New("user not found")
	}
	r := &Reply{
		ID:       pkgid.New(),
		ThreadID: threadID,
		AuthorID: authorID,
		Content:  content,
	}
	if err := s.repo.CreateReply(r); err != nil {
		return nil, err
	}
	r.Author = &AuthorInfo{ID: u.ID, Username: u.Username, Avatar: u.Avatar}
	return r, nil
}

