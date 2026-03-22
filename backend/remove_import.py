import glob
import os

repo_files = glob.glob('internal/*/repository.go')

for file_path in repo_files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Remove the unused import
    content = content.replace('\t"github.com/otr-universe/api/pkg/db"\n', '')
    
    with open(file_path, 'w') as f:
        f.write(content)

print("Removed unused imports in repositories")
