@echo off
REM MT5 Connector Auto-Start Script
REM This script runs the MT5 connector in the background

REM Change to script directory
cd /d "%~dp0"

REM Wait 30 seconds after PC boot to ensure MT5 and network are ready
timeout /t 30 /nobreak >nul

REM Kill any existing python mt5_connector processes
taskkill /F /IM python.exe /FI "WINDOWTITLE eq mt5_connector*" 2>nul

REM Start Python script in a new hidden window
start "" /min pythonw.exe mt5_connector.py

exit
