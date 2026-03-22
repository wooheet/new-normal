package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/gorm"

	pkgdb "github.com/otr-universe/api/pkg/db"
	"github.com/otr-universe/api/pkg/middleware"

	"github.com/otr-universe/api/internal/battle"
	"github.com/otr-universe/api/internal/category"
	"github.com/otr-universe/api/internal/lore"
	"github.com/otr-universe/api/internal/proposal"
	"github.com/otr-universe/api/internal/seed"
	"github.com/otr-universe/api/internal/universe"
	"github.com/otr-universe/api/internal/user"
	"github.com/otr-universe/api/internal/video"
)

func main() {
	_ = godotenv.Load()

	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	slog.SetDefault(logger)

	db := pkgdb.Connect()
	if err := autoMigrate(db); err != nil {
		slog.Error("migration failed", "error", err)
		os.Exit(1)
	}

	// Repos
	userRepo := user.NewRepository()
	loreRepo := lore.NewRepository()
	proposalRepo := proposal.NewRepository()
	battleRepo := battle.NewRepository()
	categoryRepo := category.NewRepository()
	videoRepo := video.NewRepository()
	universeRepo := universe.NewRepository()

	if err := categoryRepo.SeedDefaultCategories(); err != nil {
		slog.Warn("category seed failed", "error", err)
	}

	// Services
	userSvc := user.NewService(userRepo)
	loreSvc := lore.NewService(loreRepo)
	proposalSvc := proposal.NewService(proposalRepo, userRepo)
	battleSvc := battle.NewService(battleRepo, userRepo)
	categorySvc := category.NewService(categoryRepo, userRepo)
	videoSvc := video.NewService(videoRepo)
	universeSvc := universe.NewService(universeRepo)

	// Handlers
	userH := user.NewHandler(userSvc)
	loreH := lore.NewHandler(loreSvc)
	proposalH := proposal.NewHandler(proposalSvc)
	battleH := battle.NewHandler(battleSvc)
	categoryH := category.NewHandler(categorySvc)
	videoH := video.NewHandler(videoSvc)
	universeH := universe.NewHandler(universeSvc)

	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(slogMiddleware())
	r.Use(corsMiddleware())

	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "OTR Universe API"})
		})

		auth := api.Group("/auth")
		{
			auth.POST("/register", userH.Register)
			auth.POST("/login", userH.Login)
		}

		users := api.Group("/users")
		{
			users.GET("/me", middleware.RequireAuth(), userH.GetMe)
			users.GET("/:username", userH.GetByUsername)
		}

		loreGroup := api.Group("/lore")
		{
			loreGroup.GET("", loreH.List)
			loreGroup.GET("/:id", loreH.GetByID)
		}

		proposals := api.Group("/proposals")
		{
			proposals.GET("", proposalH.List)
			proposals.GET("/:id", proposalH.GetByID)
			proposals.POST("", middleware.RequireAuth(), proposalH.Create)
			proposals.POST("/:id/vote", middleware.RequireAuth(), proposalH.Vote)
			proposals.POST("/:id/comments", middleware.RequireAuth(), proposalH.AddComment)
		}

		battles := api.Group("/battles")
		{
			battles.GET("", battleH.List)
			battles.GET("/:id", battleH.GetByID)
			battles.POST("/:id/stake", middleware.RequireAuth(), battleH.Stake)
		}

		cats := api.Group("/categories")
		{
			cats.GET("", categoryH.ListCategories)
			cats.GET("/:slug/threads", categoryH.ListThreads)
			cats.POST("/:slug/threads", middleware.RequireAuth(), categoryH.CreateThread)
			cats.GET("/threads/:threadId", categoryH.GetThread)
			cats.POST("/threads/:threadId/replies", middleware.RequireAuth(), categoryH.CreateReply)
		}

		videos := api.Group("/videos")
		{
			videos.GET("", videoH.List)
			videos.GET("/:id", videoH.GetByID)
			videos.POST("/request", middleware.RequireAuth(), videoH.Request)
			videos.POST("/:id/complete", videoH.Complete)
		}

		universes := api.Group("/universes")
		{
			universes.GET("", universeH.List)
			universes.GET("/:slug", universeH.GetBySlug)
			universes.POST("", middleware.RequireAuth(), universeH.Create)
		}

		// Dev seed — inserts OP×DB demo lore + video job (idempotent)
		api.POST("/seed", func(c *gin.Context) {
			if err := seed.DemoData(db); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"ok": true})
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	go func() {
		slog.Info("server started", "addr", "http://localhost:"+port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("server error", "error", err)
			os.Exit(1)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	slog.Info("shutting down...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		slog.Error("forced shutdown", "error", err)
	}
	slog.Info("server stopped")
}

func autoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&user.User{},
		&lore.Entry{},
		&proposal.Proposal{},
		&proposal.Vote{},
		&proposal.Comment{},
		&battle.Battle{},
		&battle.BattleStake{},
		&category.Category{},
		&category.Thread{},
		&category.Reply{},
		&video.VideoJob{},
		&universe.Universe{},
	)
}

func slogMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		slog.Info("request",
			"method", c.Request.Method,
			"path", c.Request.URL.Path,
			"status", c.Writer.Status(),
			"duration", time.Since(start).String(),
			"ip", c.ClientIP(),
		)
	}
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin == "" {
			origin = "*"
		}
		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
