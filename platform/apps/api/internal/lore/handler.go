package lore

import (
	"strconv"

	"github.com/gin-gonic/gin"
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

	res, err := h.svc.List(
		c.Query("tier"),
		c.Query("category"),
		c.Query("search"),
		page, pageSize,
	)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, res)
}

func (h *Handler) GetByID(c *gin.Context) {
	e, err := h.svc.GetByID(c.Param("id"))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			response.NotFound(c, "Lore entry not found")
			return
		}
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, e)
}
