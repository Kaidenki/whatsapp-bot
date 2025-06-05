package utils

import (
	"fmt"
	"time"

	"github.com/shirou/gopsutil/mem"
)

var startTime time.Time

func InitUptime() {
	startTime = time.Now()
}

func UptimeSeconds() int {
	return int(time.Since(startTime).Seconds())
}

func Runtime(seconds int) string {
	d := seconds / (3600 * 24)
	h := (seconds % (3600 * 24)) / 3600
	m := (seconds % 3600) / 60
	s := seconds % 60

	dDisplay := ""
	hDisplay := ""
	mDisplay := ""
	sDisplay := ""

	if d > 0 {
		dDisplay = fmt.Sprintf("%d d, ", d)
	}
	if h > 0 {
		hDisplay = fmt.Sprintf("%d h, ", h)
	}
	if m > 0 {
		mDisplay = fmt.Sprintf("%d m, ", m)
	}
	if s > 0 {
		sDisplay = fmt.Sprintf("%d s", s)
	}

	return dDisplay + hDisplay + mDisplay + sDisplay
}

func GetDate() string {
	now := time.Now()
	return now.Format("January 2, 2006")
}

func GetRAMUsage() (string, error) {
	vmStat, err := mem.VirtualMemory()
	if err != nil {
		return "", err
	}

	used := vmStat.Used
	total := vmStat.Total

	return fmt.Sprintf("%s / %s", formatBytes(used), formatBytes(total)), nil
}

func formatBytes(bytes uint64) string {
	const unit = 1024
	if bytes < unit {
		return fmt.Sprintf("%d B", bytes)
	}
	div, exp := unit, 0
	for n := bytes / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	value := float64(bytes) / float64(div)
	return fmt.Sprintf("%.1f %cB", value, "KMGTPE"[exp])
}
