package universe

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
	res, err := h.svc.List(page, pageSize)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, res)
}

func (h *Handler) GetBySlug(c *gin.Context) {
	u, err := h.svc.GetBySlug(c.Param("slug"))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			response.NotFound(c, "Universe not found")
			return
		}
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, u)
}

func (h *Handler) Create(c *gin.Context) {
	ownerID, ok := middleware.GetUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized")
		return
	}
	var req CreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	u, err := h.svc.Create(ownerID, req)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.Created(c, u)
}
