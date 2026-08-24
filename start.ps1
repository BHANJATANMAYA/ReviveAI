Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  ReviveAI - Autonomous Revenue Recovery Agent" -ForegroundColor Green
Write-Host "  Razorpay AI Buildathon (Track 3: AI Recovery)" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; python backend/run_backend.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/frontend'; npm run dev"

Write-Host "Both servers launched!" -ForegroundColor Green
Write-Host "Frontend Dashboard: http://localhost:5173" -ForegroundColor White
Write-Host "FastAPI Docs:       http://localhost:8000/docs" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Cyan
