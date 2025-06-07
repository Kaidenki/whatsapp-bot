package db

import (
	"database/sql"
	"fmt"
)

type GroupSettings struct {
	JID         string
	Antidemote  bool
	Antipromote bool
	Welcome     bool
	WelcomeMsg  string
	Exit        bool
	ExitMsg     string
	PDM         bool
}

func GetGroupSettings(jid string) (*GroupSettings, error) {
	query := `SELECT jid, antidemote, antipromote, welcome, welcome_msg, exit, exit_msg, pdm FROM group_settings WHERE jid = $1`

	var (
		dbJID       string
		antidemote  sql.NullBool
		antipromote sql.NullBool
		welcome     sql.NullBool
		welcomeMsg  sql.NullString
		exit        sql.NullBool
		exitMsg     sql.NullString
		pdm         sql.NullBool
	)

	err := DB.QueryRow(query, jid).Scan(&dbJID, &antidemote, &antipromote, &welcome, &welcomeMsg, &exit, &exitMsg, &pdm)
	if err == sql.ErrNoRows {
		return nil, nil // No settings found, not an error
	}
	if err != nil {
		return nil, fmt.Errorf("failed to query group settings: %w", err)
	}

	return &GroupSettings{
		JID:         dbJID,
		Antidemote:  antidemote.Bool,
		Antipromote: antipromote.Bool,
		Welcome:     welcome.Bool,
		WelcomeMsg:  welcomeMsg.String,
		Exit:        exit.Bool,
		ExitMsg:     exitMsg.String,
		PDM:         pdm.Bool,
	}, nil
}

func SetGroupSettings(settings *GroupSettings) error {
	updateQuery := `
        UPDATE group_settings 
        SET antidemote = $2, antipromote = $3, welcome = $4, welcome_msg = $5, exit = $6, exit_msg = $7, pdm = $8 
        WHERE jid = $1`

	res, err := DB.Exec(updateQuery, settings.JID, settings.Antidemote, settings.Antipromote, settings.Welcome, settings.WelcomeMsg, settings.Exit, settings.ExitMsg, settings.PDM)
	if err != nil {
		return fmt.Errorf("failed to execute update for group settings: %w", err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected for group settings: %w", err)
	}

	if rowsAffected == 0 {
		insertQuery := `
            INSERT INTO group_settings (jid, antidemote, antipromote, welcome, welcome_msg, exit, exit_msg, pdm) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
		_, err = DB.Exec(insertQuery, settings.JID, settings.Antidemote, settings.Antipromote, settings.Welcome, settings.WelcomeMsg, settings.Exit, settings.ExitMsg, settings.PDM)
		if err != nil {
			return fmt.Errorf("failed to execute insert for group settings: %w", err)
		}
	}

	return nil
}

func DeleteGroupSettings(jid string) error {
	query := `DELETE FROM group_settings WHERE jid = $1`
	_, err := DB.Exec(query, jid)
	if err != nil {
		return fmt.Errorf("failed to delete group settings: %w", err)
	}
	return nil
}
