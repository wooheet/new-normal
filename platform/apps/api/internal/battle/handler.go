package battle

import (
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
	b, err := h.svc.GetByID(c.Param("id"))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			response.NotFound(c, "Battle not found")
			return
		}
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, b)
}

func (h *Handler) Stake(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized")
		return
	}
	var req StakeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	stake, err := h.svc.Stake(c.Param("id"), userID, req)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.Created(c, stake)
}
