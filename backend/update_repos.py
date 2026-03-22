import glob
import os

repo_files = glob.glob('internal/*/repository.go')

for file_path in repo_files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # We want to replace the constructor signatures
    content = content.replace(
        "func NewRepository() *Repository {",
        "func NewRepository(dbConn *gorm.DB) *Repository {"
    )
    content = content.replace(
        "return &Repository{db: db.DB}",
        "return &Repository{db: dbConn}"
    )
    
    with open(file_path, 'w') as f:
        f.write(content)

print(f"Updated {len(repo_files)} repository files.")
