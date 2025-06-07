@echo off
:loop
go run .
echo Program exited. Restarting in 1 second...
timeout /t 1 /nobreak >nul
goto loop
