import glob
import os
import re

files = ["internal/seed/seed.go", "cmd/server/main.go"]

for file_path in files:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Replace imports
    content = content.replace('"log/slog"', '"log"')
    
    # Replace usages
    content = re.sub(r'slog\.Info\("([^"]+)"(?:,?\s*"([^"]+)",\s*([^)]+))?\)', 
                     lambda m: f'log.Printf("{m.group(1)}: %v", {m.group(3)})' if m.group(3) else f'log.Printf("{m.group(1)}")', 
                     content)
    content = re.sub(r'slog\.Warn\("([^"]+)"(?:,?\s*"([^"]+)",\s*([^)]+))?\)', 
                     lambda m: f'log.Printf("WARN {m.group(1)}: %v", {m.group(3)})' if m.group(3) else f'log.Printf("WARN {m.group(1)}")', 
                     content)
    content = re.sub(r'slog\.Error\("([^"]+)"(?:,?\s*"([^"]+)",\s*([^)]+))?\)', 
                     lambda m: f'log.Printf("ERROR {m.group(1)}: %v", {m.group(3)})' if m.group(3) else f'log.Printf("ERROR {m.group(1)}")', 
                     content)
    
    # Check for slogMiddleware in main.go
    content = content.replace("slog.Info(", "log.Printf(")
    content = content.replace('func NewLogger() *slog.Logger {\n\t_ = godotenv.Load()\n\tlogger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))\n\tslog.SetDefault(logger)\n\treturn logger\n}', 'func NewLogger() {\n\t_ = godotenv.Load()\n}')
    content = content.replace('func NewDatabase(logger *slog.Logger)', 'func NewDatabase()')
    content = content.replace('func RegisterHooks(\n\tlc fx.Lifecycle,\n\tr *gin.Engine,\n\tlogger *slog.Logger,\n\tcatRepo *category.Repository,\n)', 'func RegisterHooks(\n\tlc fx.Lifecycle,\n\tr *gin.Engine,\n\tcatRepo *category.Repository,\n)')
                     
    with open(file_path, 'w') as f:
        f.write(content)

print("Replaced slog with log")
