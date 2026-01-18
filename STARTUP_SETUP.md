# Auto-Start MT5 Connector on Windows

## Method 1: Windows Startup Folder (Recommended)

1. Press `Win + R` to open Run dialog
2. Type `shell:startup` and press Enter
3. Copy the `start_mt5_connector.bat` file to this folder
4. Done! The script will run automatically when you log in to Windows

**Path:** `C:\Users\[YourUsername]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`

---

## Method 2: Task Scheduler (More Control)

1. Open **Task Scheduler** (search in Start menu)
2. Click **Create Basic Task**
3. Name: `MT5 Connector Auto-Start`
4. Trigger: **When I log on**
5. Action: **Start a program**
6. Program/script: `d:\C and C++ code\Trading-discipline\start_mt5_connector.bat`
7. Finish and check **"Open Properties dialog"**
8. In Properties:
   - General tab: Check **"Run with highest privileges"**
   - Conditions tab: Uncheck **"Start only if on AC power"**
   - Settings tab: Check **"Run task as soon as possible after scheduled start is missed"**
9. Click OK

---

## Method 3: Registry (Advanced)

1. Press `Win + R`, type `regedit`
2. Navigate to: `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run`
3. Right-click → New → String Value
4. Name: `MT5Connector`
5. Value: `"d:\C and C++ code\Trading-discipline\start_mt5_connector.bat"`

---

## Prerequisites

✅ MetaTrader 5 must start automatically (add MT5 to startup)
✅ Algo Trading must be enabled in MT5 (Tools → Options → Expert Advisors)
✅ Python must be installed and in PATH
✅ All dependencies installed (`pip install -r requirements.txt`)

---

## Testing

1. Place `start_mt5_connector.bat` in Startup folder
2. Restart your PC
3. Wait 30 seconds after login
4. Check Task Manager → Processes → Look for `python.exe`
5. Open the web app to verify connection

---

## Stopping Auto-Start

**Startup Folder Method:**
- Remove `start_mt5_connector.bat` from Startup folder

**Task Scheduler Method:**
- Open Task Scheduler → Find "MT5 Connector Auto-Start" → Right-click → Disable/Delete

**Registry Method:**
- Open regedit → Navigate to Run key → Delete "MT5Connector" value

---

## Troubleshooting

**Script not running:**
- Check Python is in PATH: `python --version`
- Verify .bat file path is correct
- Check Windows Event Viewer for errors

**MT5 not connecting:**
- Ensure MT5 starts before the script (increase timeout in .bat file)
- Enable "Algo Trading" in MT5
- Check credentials in `.env` file

**Multiple instances running:**
- Open Task Manager → End all `python.exe` processes related to mt5_connector
- Restart PC to ensure clean start
