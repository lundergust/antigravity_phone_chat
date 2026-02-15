@echo off
REM Full modern UI launch: build frontend, start server, launch ngrok

REM 1. Build React frontend
cd web
echo Installing frontend dependencies...
npm install
echo Building React frontend...
npm run build
cd ..

REM 2. Start Node server in new window
echo Starting Node server...
start "Node Server" cmd /k "node server.js"

REM 3. Wait a few seconds for server to start
timeout /t 5

REM 4. Start ngrok in new window
echo Starting ngrok...
start "Ngrok Tunnel" cmd /k "ngrok http 3000"

echo Done. Open the ngrok URL to access the UI.
pause