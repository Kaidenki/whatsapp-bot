package db

import (
	"database/sql"
	"encoding/json"
	"fmt"
)

type Antilink struct {
	JID   string
	Mode  bool
	Links []string
}

func GetAntilink(jid string) (*Antilink, error) {
	query := `SELECT jid, mode, links FROM antilink WHERE jid = $1`

	var (
		dbJID     string
		mode      bool
		linksJSON sql.NullString
	)

	err := DB.QueryRow(query, jid).Scan(&dbJID, &mode, &linksJSON)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("query failed: %w", err)
	}

	var links []string
	if linksJSON.Valid {
		if err := json.Unmarshal([]byte(linksJSON.String), &links); err != nil {
			panic(err)
		}
	}

	return &Antilink{
		JID:   dbJID,
		Mode:  mode,
		Links: links,
	}, nil
}

func SetAntilink(jid string, mode bool, links []string) error {
	linksJSON, err := json.Marshal(links)
	if err != nil {
		return fmt.Errorf("failed to marshal links: %w", err)
	}
	updateQuery := `UPDATE antilink SET mode = $1, links = $2 WHERE jid = $3`
	res, err := DB.Exec(updateQuery, mode, string(linksJSON), jid)
	if err != nil {
		return fmt.Errorf("failed to execute update: %w", err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		insertQuery := `INSERT INTO antilink (jid, mode, links) VALUES ($1, $2, $3)`
		_, err = DB.Exec(insertQuery, jid, mode, string(linksJSON))
		if err != nil {
			return fmt.Errorf("failed to execute insert: %w", err)
		}
	}

	return nil
}

func DeleteAntilink(jid string) error {
	query := `DELETE FROM antilink WHERE jid = $1`
	_, err := DB.Exec(query, jid)
	if err != nil {
		return fmt.Errorf("failed to execute delete: %w", err)
	}
	return nil
}
