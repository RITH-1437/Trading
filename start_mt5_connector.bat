@echo off
REM MT5 Connector Auto-Start Script
REM This script runs the MT5 connector in the background

cd /d "d:\C and C++ code\Trading-discipline"

REM Wait 30 seconds after PC boot to ensure MT5 and network are ready
timeout /t 30 /nobreak >nul

REM Start Python script (hidden window)
start /min python mt5_connector.py

exit
