package proposal

import (
	"errors"
	"fmt"
	"math"
	"time"

	"github.com/otr-universe/api/internal/user"
	pkgid "github.com/otr-universe/api/pkg/id"
	"gorm.io/gorm"
)

type Service struct {
	repo     *Repository
	userRepo *user.Repository
}

func NewService(repo *Repository, userRepo *user.Repository) *Service {
	return &Service{repo: repo, userRepo: userRepo}
}

func (s *Service) List(status string, page, pageSize int) (*ListResponse, error) {
	proposals, total, err := s.repo.List(status, page, pageSize)
	if err != nil {
		return nil, err
	}
	s.enrichAuthors(proposals)
	return &ListResponse{Data: proposals, Total: total, Page: page, PageSize: pageSize}, nil
}

func (s *Service) GetByID(id string) (*Proposal, error) {
	p, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	s.enrichAuthors([]Proposal{*p})

	// Batch-fetch comment authors
	if len(p.Comments) > 0 {
		ids := make([]string, len(p.Comments))
		for i, c := range p.Comments {
			ids[i] = c.AuthorID
		}
		authors, err := s.repo.AuthorsByIDs(ids)
		if err == nil {
			for i := range p.Comments {
				if a, ok := authors[p.Comments[i].AuthorID]; ok {
					p.Comments[i].Author = &a
				}
			}
		}
	}
	return p, nil
}

func (s *Service) Create(req CreateRequest, authorID string) (*Proposal, error) {
	u, err := s.userRepo.FindByID(authorID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	thresh := GetThresholds(req.Type, req.TargetTier)
	if u.LorePoints < thresh.Staking {
		return nil, fmt.Errorf("insufficient LORE points: need %d, have %d", thresh.Staking, u.LorePoints)
	}

	lastLIP, err := s.repo.LastLIPNumber()
	if err != nil {
		return nil, fmt.Errorf("could not assign LIP number: %w", err)
	}

	now := time.Now()
	discEnd := now.Add(time.Duration(thresh.Discussion) * 24 * time.Hour)
	voteEnd := discEnd.Add(time.Duration(thresh.Voting) * 24 * time.Hour)

	p := &Proposal{
		ID:                pkgid.New(),
		LIPNumber:         lastLIP + 1,
		Title:             req.Title,
		Summary:           req.Summary,
		Content:           req.Content,
		Type:              req.Type,
		TargetTier:        req.TargetTier,
		Category:          req.Category,
		Status:            StatusReview,
		StakingAmount:     thresh.Staking,
		QuorumRequired:    thresh.Quorum,
		ThresholdRequired: thresh.Threshold,
		DiscussionEndsAt:  &discEnd,
		VotingEndsAt:      &voteEnd,
		AuthorID:          authorID,
	}
	if err := s.repo.Create(p); err != nil {
		return nil, err
	}
	if err := s.userRepo.UpdatePoints(authorID, -thresh.Staking); err != nil {
		return nil, fmt.Errorf("staking deduction failed: %w", err)
	}

	s.enrichAuthors([]Proposal{*p})
	return p, nil
}

func (s *Service) Vote(proposalID, userID, choice string) (*Vote, error) {
	p, err := s.repo.FindByID(proposalID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("proposal not found")
		}
		return nil, err
	}
	if p.Status != StatusVoting {
		return nil, errors.New("voting is not active for this proposal")
	}
	if p.VotingEndsAt != nil && time.Now().After(*p.VotingEndsAt) {
		return nil, errors.New("voting period has ended")
	}

	if _, err := s.repo.FindVote(proposalID, userID); err == nil {
		return nil, errors.New("already voted")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	u, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	weight := 1
	if u.LorePoints > 0 {
		weight = int(math.Sqrt(float64(u.LorePoints)))
		if weight < 1 {
			weight = 1
		}
	}

	v := &Vote{
		ID:         pkgid.New(),
		ProposalID: proposalID,
		UserID:     userID,
		Choice:     choice,
		Weight:     weight,
	}
	if err := s.repo.CreateVote(v); err != nil {
		return nil, err
	}
	// Reward participation — best-effort, non-fatal
	_ = s.userRepo.UpdatePoints(userID, 10)
	return v, nil
}

func (s *Service) AddComment(proposalID, userID, content string) (*Comment, error) {
	u, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}
	c := &Comment{
		ID:         pkgid.New(),
		ProposalID: proposalID,
		AuthorID:   userID,
		Content:    content,
	}
	if err := s.repo.CreateComment(c); err != nil {
		return nil, err
	}
	c.Author = &AuthorInfo{ID: u.ID, Username: u.Username, Avatar: u.Avatar}
	return c, nil
}

// enrichAuthors batch-fetches author info for a slice of proposals.
func (s *Service) enrichAuthors(proposals []Proposal) {
	if len(proposals) == 0 {
		return
	}
	ids := make([]string, 0, len(proposals))
	seen := make(map[string]bool)
	for _, p := range proposals {
		if !seen[p.AuthorID] {
			ids = append(ids, p.AuthorID)
			seen[p.AuthorID] = true
		}
	}
	authors, err := s.repo.AuthorsByIDs(ids)
	if err != nil {
		return
	}
	for i := range proposals {
		if a, ok := authors[proposals[i].AuthorID]; ok {
			proposals[i].Author = &a
		}
	}
}
