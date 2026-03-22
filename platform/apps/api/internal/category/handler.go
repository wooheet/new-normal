package category

import (
	"errors"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/otr-universe/api/pkg/middleware"
	"github.com/otr-universe/api/pkg/response"
	"gorm.io/gorm"
)

type Handler struct {
	svc *Service
}

func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) ListCategories(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)
	cats, err := h.svc.ListCategories(userID)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, cats)
}

func (h *Handler) ListThreads(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "20"))
	userID, _ := middleware.GetUserID(c)

	res, err := h.svc.ListThreads(c.Param("slug"), page, pageSize, userID)
	if err != nil {
		if err.Error() == "category not found" {
			response.NotFound(c, err.Error())
			return
		}
		response.BadRequest(c, err.Error())
		return
	}
	response.OK(c, res)
}

func (h *Handler) GetThread(c *gin.Context) {
	t, err := h.svc.GetThread(c.Param("threadId"))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			response.NotFound(c, "Thread not found")
			return
		}
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, t)
}

func (h *Handler) CreateThread(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized")
		return
	}
	var req CreateThreadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	t, err := h.svc.CreateThread(c.Param("slug"), userID, req)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.Created(c, t)
}

func (h *Handler) CreateReply(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized")
		return
	}
	var req CreateReplyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	r, err := h.svc.CreateReply(c.Param("threadId"), userID, req.Content)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.Created(c, r)
}
