package proposal

import (
	"errors"
	"net/http"
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
	res, err := h.svc.List(c.Query("status"), page, pageSize)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, res)
}

func (h *Handler) GetByID(c *gin.Context) {
	p, err := h.svc.GetByID(c.Param("id"))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			response.NotFound(c, "Proposal not found")
			return
		}
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, p)
}

func (h *Handler) Create(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized")
		return
	}
	var req CreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	p, err := h.svc.Create(req, userID)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.Created(c, p)
}

func (h *Handler) Vote(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized")
		return
	}
	var req VoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	v, err := h.svc.Vote(c.Param("id"), userID, req.Choice)
	if err != nil {
		if err.Error() == "already voted" {
			c.JSON(http.StatusConflict, gin.H{"message": err.Error()})
			return
		}
		response.BadRequest(c, err.Error())
		return
	}
	response.Created(c, v)
}

func (h *Handler) AddComment(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized")
		return
	}
	var req CommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	comment, err := h.svc.AddComment(c.Param("id"), userID, req.Content)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.Created(c, comment)
}
