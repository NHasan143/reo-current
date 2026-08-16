@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem ---------------------------------------------------------------------------
rem REO Current - one-click local stop
rem
rem Stops whatever is serving the site on port 3000, including the Node child
rem processes the Next.js dev server spawned.
rem ---------------------------------------------------------------------------

cd /d "%~dp0"
title REO Current - stop dev server

echo.
echo  ============================================
echo   REO Current - stopping local development
echo  ============================================
echo.

set "FOUND="
set "KILLED="

for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:":3000 .*LISTENING"') do (
  if not "%%p"=="0" (
    set "FOUND=1"
    rem The same PID appears twice for IPv4 and IPv6; skip the repeat.
    echo !KILLED! | findstr /c:"[%%p]" >nul 2>&1
    if errorlevel 1 (
      set "KILLED=!KILLED![%%p]"
      echo  [i] Stopping process %%p and its children...
      taskkill /PID %%p /T /F >nul 2>&1
      if errorlevel 1 (
        echo  [!] Could not stop PID %%p. Try running this file as Administrator.
      ) else (
        echo  [ok] Stopped PID %%p.
      )
    )
  )
)

if not defined FOUND (
  echo  [i] Nothing was listening on port 3000 - the server is already stopped.
  echo.
  ping -n 4 127.0.0.1 >nul
  exit /b 0
)

rem Confirm the port actually freed up.
ping -n 2 127.0.0.1 >nul
netstat -ano | findstr /r /c:":3000 .*LISTENING" >nul 2>&1
if errorlevel 1 (
  echo.
  echo  [ok] Port 3000 is free. Run start.bat to bring the site back up.
) else (
  echo.
  echo  [!] Something is still holding port 3000. Try again, or run this file
  echo      as Administrator.
)

echo.
ping -n 5 127.0.0.1 >nul
exit /b 0
