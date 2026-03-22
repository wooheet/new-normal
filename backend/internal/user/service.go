package user

import (
	"errors"

	"github.com/otr-universe/api/pkg/auth"
	pkgid "github.com/otr-universe/api/pkg/id"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

type AuthResponse struct {
	Token string     `json:"token"`
	User  PublicUser `json:"user"`
}

func (s *Service) Register(req RegisterRequest) (*AuthResponse, error) {
	if _, err := s.repo.FindByEmail(req.Email); err == nil {
		return nil, errors.New("email already registered")
	}
	if _, err := s.repo.FindByUsername(req.Username); err == nil {
		return nil, errors.New("username already taken")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	u := &User{
		ID:           pkgid.New(),
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: string(hash),
		LorePoints:   100,
	}
	if err := s.repo.Create(u); err != nil {
		return nil, err
	}

	token, err := auth.GenerateToken(u.ID)
	if err != nil {
		return nil, err
	}
	return &AuthResponse{Token: token, User: toPublic(u)}, nil
}

func (s *Service) Login(req LoginRequest) (*AuthResponse, error) {
	u, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid credentials")
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	token, err := auth.GenerateToken(u.ID)
	if err != nil {
		return nil, err
	}
	return &AuthResponse{Token: token, User: toPublic(u)}, nil
}

func (s *Service) GetMe(userID string) (*User, error) {
	return s.repo.FindByID(userID)
}

func (s *Service) GetByUsername(username string) (*PublicUser, error) {
	u, err := s.repo.FindByUsername(username)
	if err != nil {
		return nil, err
	}
	pub := toPublic(u)
	return &pub, nil
}

func toPublic(u *User) PublicUser {
	return PublicUser{
		ID:             u.ID,
		Username:       u.Username,
		Avatar:         u.Avatar,
		Bio:            u.Bio,
		MembershipTier: u.MembershipTier,
		LorePoints:     u.LorePoints,
		CreatedAt:      u.CreatedAt,
	}
}
