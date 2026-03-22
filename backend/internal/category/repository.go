package category

import (
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(dbConn *gorm.DB) *Repository {
	return &Repository{db: dbConn}
}

func (r *Repository) ListCategories() ([]Category, error) {
	var cats []Category
	if err := r.db.Find(&cats).Error; err != nil {
		return nil, err
	}

	// Batch count threads per category in a single query
	type countRow struct {
		CategoryID int
		Count      int64
	}
	var counts []countRow
	r.db.Table("threads").
		Select("category_id, count(*) as count").
		Group("category_id").
		Find(&counts)

	countMap := make(map[int]int64, len(counts))
	for _, c := range counts {
		countMap[c.CategoryID] = c.Count
	}
	for i := range cats {
		cats[i].ThreadCount = countMap[cats[i].ID]
	}
	return cats, nil
}

func (r *Repository) FindCategoryBySlug(slug string) (*Category, error) {
	var cat Category
	err := r.db.Where("slug = ?", slug).First(&cat).Error
	return &cat, err
}

func (r *Repository) ListThreads(categoryID int, page, pageSize int) ([]Thread, int64, error) {
	var total int64
	if err := r.db.Model(&Thread{}).Where("category_id = ?", categoryID).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	offset := (page - 1) * pageSize
	var threads []Thread
	err := r.db.Where("category_id = ?", categoryID).
		Order("is_pinned desc, created_at desc").
		Offset(offset).Limit(pageSize).
		Find(&threads).Error
	return threads, total, err
}

func (r *Repository) FindThread(id string) (*Thread, error) {
	var t Thread
	err := r.db.Preload("Replies").First(&t, "id = ?", id).Error
	return &t, err
}

func (r *Repository) CreateThread(t *Thread) error {
	return r.db.Create(t).Error
}

func (r *Repository) CreateReply(reply *Reply) error {
	return r.db.Create(reply).Error
}

func (r *Repository) IncrementViews(threadID string) {
	r.db.Model(&Thread{}).Where("id = ?", threadID).
		UpdateColumn("view_count", gorm.Expr("view_count + 1"))
}

// ReplyCountsByThreadIDs returns a map[threadID]count in a single query.
func (r *Repository) ReplyCountsByThreadIDs(ids []string) (map[string]int64, error) {
	type row struct {
		ThreadID string
		Count    int64
	}
	var rows []row
	if err := r.db.Table("replies").
		Select("thread_id, count(*) as count").
		Where("thread_id IN ?", ids).
		Group("thread_id").
		Find(&rows).Error; err != nil {
		return nil, err
	}
	m := make(map[string]int64, len(rows))
	for _, row := range rows {
		m[row.ThreadID] = row.Count
	}
	return m, nil
}

// AuthorsByIDs returns a map[userID]AuthorInfo for a batch of user IDs.
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
	for _, row := range rows {
		m[row.ID] = AuthorInfo{ID: row.ID, Username: row.Username, Avatar: row.Avatar}
	}
	return m, nil
}

func (r *Repository) SeedDefaultCategories() error {
	for _, cat := range DefaultCategories {
		c := cat // avoid loop-variable capture
		if err := r.db.Where(Category{Slug: c.Slug}).FirstOrCreate(&c).Error; err != nil {
			return err
		}
	}
	return nil
}
