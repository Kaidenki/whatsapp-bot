package helpers

import (
	"net/url"
	"strings"
)

func FormatPostgresURL(dbURL string, env string) (string, bool) {
	if !strings.HasPrefix(dbURL, "postgres://") && !strings.HasPrefix(dbURL, "postgresql://") {
		return dbURL, false
	}

	u, err := url.Parse(dbURL)
	if err != nil || u.User == nil || u.Host == "" || u.Path == "" || u.Path == "/" {
		return dbURL, false
	}

	if env == "development" {
		q := u.Query()
		if q.Get("sslmode") == "" {
			q.Set("sslmode", "disable")
			u.RawQuery = q.Encode()
		}
	}

	return u.String(), true
}
