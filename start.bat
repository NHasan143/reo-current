@echo off
setlocal EnableExtensions

rem ---------------------------------------------------------------------------
rem REO Current - one-click local start
rem
rem Installs dependencies, creates .env, seeds the database (all only if
rem missing), then runs the Next.js dev server and opens the browser.
rem Close this window or run stop.bat to stop the server.
rem ---------------------------------------------------------------------------

rem Re-entry point: a second copy of this script waits for the port, then opens
rem the browser. Keeps everything in one file.
if /i "%~1"=="--open-when-ready" goto openwhenready

cd /d "%~dp0"
title REO Current - dev server

echo.
echo  ============================================
echo   REO Current - starting local development
echo  ============================================
echo.

rem --- Node present? --------------------------------------------------------
where node >nul 2>&1
if errorlevel 1 (
  echo  [X] Node.js was not found on your PATH.
  echo      Install Node.js 20.18+ from https://nodejs.org and run this again.
  echo.
  pause
  exit /b 1
)
for /f "delims=" %%v in ('node -v') do set "NODEVER=%%v"
echo  [i] Node %NODEVER%

rem --- Already running? -----------------------------------------------------
netstat -ano | findstr /r /c:":3000 .*LISTENING" >nul 2>&1
if not errorlevel 1 (
  echo  [i] Something is already listening on port 3000.
  echo      Opening the browser instead of starting a second server.
  echo      Run stop.bat first if you want a clean restart.
  start "" "http://localhost:3000"
  echo.
  pause
  exit /b 0
)

rem --- Dependencies ---------------------------------------------------------
if not exist "node_modules\" (
  echo  [1/4] Installing dependencies ^(first run, this takes a few minutes^)...
  call npm install
  if errorlevel 1 goto failed
) else (
  echo  [1/4] Dependencies already installed.
)

rem --- Environment file -----------------------------------------------------
if not exist ".env" (
  echo  [2/4] Creating .env with a new random PAYLOAD_SECRET...
  set "SECRET="
  for /f "delims=" %%s in ('powershell -NoProfile -Command "[guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')"') do set "SECRET=%%s"
  if not defined SECRET (
    echo  [X] Could not generate a secret.
    goto failed
  )
  >  ".env" echo PAYLOAD_SECRET=%SECRET%
  >> ".env" echo DATABASE_URI=file:./reo-cms.db
  >> ".env" echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
) else (
  echo  [2/4] .env already present.
)

rem --- Database -------------------------------------------------------------
if not exist "reo-cms.db" (
  echo  [3/4] Seeding the local database with demo content...
  call npm run seed
  if errorlevel 1 goto failed
  echo       Admin login: admin@reocurrent.com / changeme123
) else (
  echo  [3/4] Database reo-cms.db already exists ^(not reseeding^).
)

rem --- Dev server -----------------------------------------------------------
echo  [4/4] Starting the dev server...
echo.
echo       Website : http://localhost:3000
echo       CMS     : http://localhost:3000/admin
echo.
echo       The browser opens automatically once the server is ready.
echo       Press Ctrl+C in this window, or run stop.bat, to stop it.
echo.

start "" /min cmd /c ""%~f0" --open-when-ready"
call npm run dev

echo.
echo  [i] The dev server has stopped.
pause
exit /b 0

rem ---------------------------------------------------------------------------
:openwhenready
rem Wait until port 3000 accepts connections, then open the browser.
rem Gives up after roughly two minutes.
set /a TRIES=0
:waitloop
set /a TRIES+=1
if %TRIES% GTR 120 exit /b 0
netstat -ano | findstr /r /c:":3000 .*LISTENING" >nul 2>&1
if errorlevel 1 (
  ping -n 2 127.0.0.1 >nul
  goto waitloop
)
start "" "http://localhost:3000"
exit /b 0

rem ---------------------------------------------------------------------------
:failed
echo.
echo  [X] Startup failed. Read the messages above for the cause.
echo.
pause
exit /b 1
