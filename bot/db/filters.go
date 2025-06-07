package db

import (
	"database/sql"
	"fmt"
	"strings"
)

type Filter interface {
	isFilter()
}

type GroupFilter struct {
	ID      int
	Chat    string
	Pattern string
	Text    string
	Regex   bool
}

func (f GroupFilter) isFilter() {}

type PersonalFilter struct {
	ID      int
	Pattern string
	Text    string
	Regex   bool
}

func (f PersonalFilter) isFilter() {}

func GetFilters(filterType string, jid string, pattern *string) ([]Filter, error) {
	var rows *sql.Rows
	var err error

	if filterType == "group" {
		query := "SELECT id, chat, pattern, text, regex FROM group_filters WHERE chat = $1"
		args := []interface{}{jid}
		if pattern != nil {
			query += " AND pattern = $2"
			args = append(args, *pattern)
		}
		rows, err = DB.Query(query, args...)
	} else if filterType == "pm" {
		query := "SELECT id, pattern, text, regex FROM personal_filters"
		args := []interface{}{}
		if pattern != nil {
			query += " WHERE pattern = $1"
			args = append(args, *pattern)
		}
		rows, err = DB.Query(query, args...)
	} else {
		return nil, fmt.Errorf("invalid filter type: %s", filterType)
	}

	if err != nil {
		return nil, fmt.Errorf("query failed: %w", err)
	}
	defer rows.Close()

	var filters []Filter
	for rows.Next() {
		if filterType == "group" {
			var f GroupFilter
			if err := rows.Scan(&f.ID, &f.Chat, &f.Pattern, &f.Text, &f.Regex); err != nil {
				return nil, fmt.Errorf("failed to scan group filter: %w", err)
			}
			filters = append(filters, f)
		} else {
			var f PersonalFilter
			if err := rows.Scan(&f.ID, &f.Pattern, &f.Text, &f.Regex); err != nil {
				return nil, fmt.Errorf("failed to scan personal filter: %w", err)
			}
			filters = append(filters, f)
		}
	}
	return filters, nil
}

func SetFilter(filterType string, jid string, pattern string, text string, regex bool) error {
	var query string
	var args []interface{}

	if filterType == "group" {
		query = "INSERT INTO group_filters (chat, pattern, text, regex) VALUES ($1, $2, $3, $4)"
		args = []interface{}{jid, pattern, strings.ToLower(text), regex}
	} else if filterType == "pm" {
		query = "INSERT INTO personal_filters (pattern, text, regex) VALUES ($1, $2, $3)"
		args = []interface{}{pattern, text, regex}
	} else {
		return fmt.Errorf("invalid filter type: %s", filterType)
	}

	_, err := DB.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute insert: %w", err)
	}
	return nil
}

func DeleteFilter(filterType string, jid string, pattern string) (bool, error) {
	var query string
	var args []interface{}

	if filterType == "group" {
		query = "DELETE FROM group_filters WHERE chat = $1 AND pattern = $2"
		args = []interface{}{jid, pattern}
	} else if filterType == "pm" {
		query = "DELETE FROM personal_filters WHERE pattern = $1"
		args = []interface{}{pattern}
	} else {
		return false, fmt.Errorf("invalid filter type: %s", filterType)
	}

	res, err := DB.Exec(query, args...)
	if err != nil {
		return false, fmt.Errorf("failed to execute delete: %w", err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return false, fmt.Errorf("failed to get rows affected: %w", err)
	}

	return rowsAffected > 0, nil
}
