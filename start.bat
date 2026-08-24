@echo off
echo ===================================================
echo   ReviveAI - Autonomous Revenue Recovery Agent
echo   Razorpay AI Buildathon (Track 3: AI Recovery)
echo ===================================================
echo Starting FastAPI Backend (Port 8000)...
start "ReviveAI Backend" cmd /k "cd /d %~dp0 && python backend/run_backend.py"

echo Starting Vite Frontend (Port 5173)...
start "ReviveAI Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo.
echo Both servers are launching!
echo App UI: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo ===================================================
pause
