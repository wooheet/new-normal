package battle

import (
	"errors"
	"fmt"
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
	battles, total, err := s.repo.List(status, page, pageSize)
	if err != nil {
		return nil, err
	}
	for i := range battles {
		battles[i].VideoQuality = VideoQuality(battles[i].SideAStake + battles[i].SideBStake)
	}
	return &ListResponse{Data: battles, Total: total, Page: page, PageSize: pageSize}, nil
}

func (s *Service) GetByID(id string) (*Battle, error) {
	b, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("battle not found")
		}
		return nil, err
	}
	b.VideoQuality = VideoQuality(b.SideAStake + b.SideBStake)

	// Batch-fetch stake usernames
	if len(b.Stakes) > 0 {
		ids := make([]string, len(b.Stakes))
		for i, st := range b.Stakes {
			ids[i] = st.UserID
		}
		users, err := s.repo.UsernamesByIDs(ids)
		if err == nil {
			for i := range b.Stakes {
				b.Stakes[i].Username = users[b.Stakes[i].UserID]
			}
		}
	}
	return b, nil
}

func (s *Service) Stake(battleID, userID string, req StakeRequest) (*BattleStake, error) {
	b, err := s.repo.FindByID(battleID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("battle not found")
		}
		return nil, err
	}
	if b.Status != StatusOpen {
		return nil, errors.New("battle is not open for staking")
	}
	if b.EndsAt != nil && time.Now().After(*b.EndsAt) {
		return nil, errors.New("battle has ended")
	}

	u, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}
	if u.LorePoints < req.Amount {
		return nil, fmt.Errorf("insufficient LORE: need %d, have %d", req.Amount, u.LorePoints)
	}

	stake := &BattleStake{
		ID:       pkgid.New(),
		BattleID: battleID,
		UserID:   userID,
		Side:     req.Side,
		Amount:   req.Amount,
	}
	if err := s.repo.CreateStake(stake); err != nil {
		return nil, err
	}
	if err := s.repo.AddStakeToSide(battleID, req.Side, req.Amount); err != nil {
		return nil, fmt.Errorf("stake recorded but side total update failed: %w", err)
	}
	if err := s.userRepo.UpdatePoints(userID, -req.Amount); err != nil {
		return nil, fmt.Errorf("stake recorded but point deduction failed: %w", err)
	}

	stake.Username = u.Username
	return stake, nil
}
