Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Launching Smart Interview Simulation Platform" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

Write-Host "[1/4] Starting C++ Code Evaluation Engine (:8082)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\evaluator-service'; .\evaluator_service.exe 8082"

Start-Sleep -Seconds 1

Write-Host "[2/4] Starting Python NLP Feedback Engine (:8081)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\nlp-service'; python server.py"

Start-Sleep -Seconds 1

Write-Host "[3/4] Starting Node.js API Gateway (:5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; node src/server.js"

Start-Sleep -Seconds 1

Write-Host "[4/4] Starting React Frontend (:3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; node ./node_modules/vite/bin/vite.js"

Write-Host "========================================================" -ForegroundColor Green
Write-Host "  All 4 Platform Services Launched Successfully!" -ForegroundColor Green
Write-Host "  - Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "  - Node API:    http://localhost:5000" -ForegroundColor White
Write-Host "  - Swagger:     http://localhost:5000/api/docs" -ForegroundColor White
Write-Host "  - Python NLP:  http://localhost:8081/health" -ForegroundColor White
Write-Host "  - C++ Engine:  http://localhost:8082/health" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green
