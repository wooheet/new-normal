package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/otr-universe/api/pkg/auth"
	"github.com/otr-universe/api/pkg/response"
)

const UserIDKey = "userID"

func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			response.Unauthorized(c, "Authorization required")
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(header, "Bearer ")
		claims, err := auth.ParseToken(tokenStr)
		if err != nil {
			response.Unauthorized(c, "Invalid or expired token")
			c.Abort()
			return
		}

		c.Set(UserIDKey, claims.UserID)
		c.Next()
	}
}

func GetUserID(c *gin.Context) (string, bool) {
	val, exists := c.Get(UserIDKey)
	if !exists {
		return "", false
	}
	userID, ok := val.(string)
	return userID, ok
}
