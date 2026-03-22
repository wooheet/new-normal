package video

import (
	"fmt"
	"time"

	pkgid "github.com/otr-universe/api/pkg/id"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) List(universeID, contentType string, page, pageSize int, includeAdult bool) (*ListResponse, error) {
	jobs, total, err := s.repo.List(universeID, contentType, page, pageSize, includeAdult)
	if err != nil {
		return nil, err
	}
	return &ListResponse{Data: jobs, Total: total, Page: page, PageSize: pageSize}, nil
}

func (s *Service) GetByID(id string) (*VideoJob, error) {
	return s.repo.FindByID(id)
}

// Enqueue is called internally when a proposal is approved or battle ends.
func (s *Service) Enqueue(title, contentType, sourceID, prompt, requesterID string, stake int64, isAdult bool) (*VideoJob, error) {
	j := &VideoJob{
		ID:          pkgid.New(),
		Title:       title,
		ContentType: ContentType(contentType),
		SourceID:    sourceID,
		Prompt:      prompt,
		Status:      StatusQueued,
		Quality:     qualityFromStake(stake),
		TotalStake:  stake,
		RequesterID: requesterID,
		IsAdultOnly: isAdult,
		CreatedAt:   time.Now(),
	}
	if err := s.repo.Create(j); err != nil {
		return nil, fmt.Errorf("enqueue video job: %w", err)
	}
	return j, nil
}

// Request is called by community members to queue a new video job.
func (s *Service) Request(requesterID string, in VideoRequestInput) (*VideoJob, error) {
	j := &VideoJob{
		ID:          pkgid.New(),
		UniverseID:  in.UniverseID,
		Title:       in.Title,
		ContentType: ContentType(in.ContentType),
		SourceID:    in.SourceID,
		Prompt:      in.Prompt,
		Status:      StatusQueued,
		Quality:     qualityFromStake(in.Stake),
		TotalStake:  in.Stake,
		RequesterID: requesterID,
		IsAdultOnly: false,
		CreatedAt:   time.Now(),
	}
	if err := s.repo.Create(j); err != nil {
		return nil, fmt.Errorf("request video job: %w", err)
	}
	return j, nil
}

// Complete simulates AI pipeline callback — marks job done with real video URL.
func (s *Service) Complete(id string, in CompleteInput) error {
	return s.repo.UpdateStatus(id, StatusCompleted, in.VideoURL, in.ThumbnailURL, in.Duration)
}

func qualityFromStake(stake int64) string {
	switch {
	case stake >= 200_000:
		return "4K+"
	case stake >= 50_000:
		return "4K"
	case stake >= 10_000:
		return "HD"
	default:
		return "SD"
	}
}
