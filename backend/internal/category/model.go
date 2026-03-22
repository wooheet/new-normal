package category

import "time"

// Netflix 트렌드 기반 15개 커뮤니티 카테고리

type Category struct {
	ID          int       `gorm:"primaryKey;autoIncrement" json:"id"`
	Slug        string    `gorm:"uniqueIndex;not null" json:"slug"`
	Name        string    `gorm:"not null" json:"name"`
	NameKo      string    `json:"nameKo"`
	Description string    `json:"description"`
	Icon        string    `json:"icon"`
	IsAdultOnly bool      `gorm:"default:false" json:"isAdultOnly"`
	ThreadCount int64     `gorm:"-" json:"threadCount"`
	CreatedAt   time.Time `json:"createdAt"`
}

type Thread struct {
	ID         string    `gorm:"primaryKey;type:varchar(36)" json:"id"`
	CategoryID int       `gorm:"not null;index" json:"categoryId"`
	AuthorID   string    `gorm:"not null" json:"authorId"`
	Title      string    `gorm:"not null" json:"title"`
	Content    string    `gorm:"type:text" json:"content"`
	IsPinned   bool      `gorm:"default:false" json:"isPinned"`
	ViewCount  int64     `gorm:"default:0" json:"viewCount"`
	ReplyCount int64     `gorm:"-" json:"replyCount"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`

	Author   *AuthorInfo `gorm:"-" json:"author,omitempty"`
	Replies  []Reply     `gorm:"foreignKey:ThreadID" json:"replies,omitempty"`
}

type Reply struct {
	ID        string    `gorm:"primaryKey;type:varchar(36)" json:"id"`
	ThreadID  string    `gorm:"not null;index" json:"threadId"`
	AuthorID  string    `gorm:"not null" json:"authorId"`
	Content   string    `gorm:"not null" json:"content"`
	CreatedAt time.Time `json:"createdAt"`
	Author    *AuthorInfo `gorm:"-" json:"author,omitempty"`
}

type AuthorInfo struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Avatar   string `json:"avatar"`
}

type CreateThreadRequest struct {
	Title   string `json:"title" binding:"required,min=5,max=200"`
	Content string `json:"content" binding:"required,min=10"`
}

type CreateReplyRequest struct {
	Content string `json:"content" binding:"required,min=2"`
}

type ThreadListResponse struct {
	Data     []Thread `json:"data"`
	Total    int64    `json:"total"`
	Page     int      `json:"page"`
	PageSize int      `json:"pageSize"`
}

// DefaultCategories — Netflix 트렌드 기반 커뮤니티 카테고리 시드 데이터
var DefaultCategories = []Category{
	{Slug: "crime-thriller", Name: "Crime & Thriller", NameKo: "범죄 & 스릴러", Description: "범죄, 수사, 서스펜스 시나리오", Icon: "🔍"},
	{Slug: "fantasy-worldbuilding", Name: "Fantasy & World-Building", NameKo: "판타지 & 세계관", Description: "서사적 판타지, OTR Universe 핵심 세계관 확장", Icon: "⚔️"},
	{Slug: "sci-fi-futurism", Name: "Sci-Fi & Futurism", NameKo: "SF & 미래", Description: "AI, 우주, 디스토피아, 미래 시나리오", Icon: "🚀"},
	{Slug: "psychological-thriller", Name: "Psychological Thriller", NameKo: "심리 스릴러", Description: "심리 서스펜스, 반전, 불안을 자극하는 서사", Icon: "🧠"},
	{Slug: "romance", Name: "Romance & Relationships", NameKo: "로맨스 & 연애", Description: "로맨스, 연애 방식, 관계 드라마", Icon: "💕"},
	{Slug: "action-adventure", Name: "Action & Adventure", NameKo: "액션 & 모험", Description: "배틀, 전쟁, 탐험 시나리오", Icon: "⚡"},
	{Slug: "period-historical", Name: "Period & Historical", NameKo: "시대극 & 역사", Description: "역사적 배경, 시대극 시나리오", Icon: "🏰"},
	{Slug: "k-drama-asian", Name: "K-Drama & Asian Wave", NameKo: "K-드라마 & 아시아", Description: "한국/아시아 드라마 스타일 시나리오", Icon: "🌸"},
	{Slug: "comedy-slice-of-life", Name: "Comedy & Slice of Life", NameKo: "코미디 & 일상", Description: "일상, 코미디, 힐링 시나리오", Icon: "😄"},
	{Slug: "sports-competition", Name: "Sports & Competition", NameKo: "스포츠 & 경쟁", Description: "스포츠 드라마, 경쟁 서사 — 배틀 아레나 연계", Icon: "🏆"},
	{Slug: "supernatural-horror", Name: "Supernatural & Horror", NameKo: "초자연 & 공포", Description: "초자연, 공포, 오컬트 시나리오", Icon: "👻"},
	{Slug: "interactive-branching", Name: "Interactive & Branching", NameKo: "인터랙티브 & 분기", Description: "분기 스토리, 선택지 시나리오", Icon: "🔀"},
	{Slug: "anime-style", Name: "Anime & Animation", NameKo: "애니메이션 스타일", Description: "애니메이션 미학의 시나리오", Icon: "🎌"},
	{Slug: "documentary", Name: "Documentary Style", NameKo: "다큐 스타일", Description: "다큐 형식의 세계관 탐구 및 설정 분석", Icon: "🎬"},
	{Slug: "adult-plus", Name: "Adult+ Scenarios", NameKo: "성인 시나리오", Description: "KYC 인증 필요. 성인 로맨스 및 개인 맞춤 시나리오", Icon: "🔞", IsAdultOnly: true},
}
