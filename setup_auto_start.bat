@echo off
echo ========================================
echo MT5 Connector Auto-Start Setup
echo ========================================
echo.

REM Get the startup folder path
set STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup

echo Current script location: %~dp0
echo Startup folder: %STARTUP%
echo.

REM Copy the start script to startup folder
echo Copying start_mt5_connector.bat to Startup folder...
copy /Y "%~dp0start_mt5_connector.bat" "%STARTUP%\start_mt5_connector.bat"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Auto-start is now configured.
    echo ========================================
    echo.
    echo The MT5 connector will start automatically when you log in.
    echo It will wait 30 seconds after boot before starting.
    echo.
    echo To verify: Restart your PC and check Task Manager for python.exe
    echo.
) else (
    echo.
    echo ERROR: Failed to copy file.
    echo Please run this script as Administrator.
    echo.
)

echo Press any key to exit...
pause >nul
