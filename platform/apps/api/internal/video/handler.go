package video

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

func (h *Handler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "20"))
	userID, _ := middleware.GetUserID(c)

	res, err := h.svc.List(c.Query("universe"), c.Query("type"), page, pageSize, userID != "")
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, res)
}

func (h *Handler) GetByID(c *gin.Context) {
	j, err := h.svc.GetByID(c.Param("id"))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			response.NotFound(c, "Video not found")
			return
		}
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, j)
}

// Request is called by authenticated community members to submit a video request.
func (h *Handler) Request(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized")
		return
	}
	var req VideoRequestInput
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	j, err := h.svc.Request(userID, req)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.Created(c, j)
}

// Complete is an internal callback endpoint that simulates AI pipeline completion.
func (h *Handler) Complete(c *gin.Context) {
	var req CompleteInput
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	if err := h.svc.Complete(c.Param("id"), req); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			response.NotFound(c, "Video job not found")
			return
		}
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, gin.H{"ok": true})
}
