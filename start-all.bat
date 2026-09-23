@echo off
echo ========================================================
echo   Launching Smart Interview Simulation Platform
echo ========================================================

echo [1/4] Starting C++ Code Evaluation Engine (:8082)...
start "C++ Evaluator Service" cmd /c "cd /d "%~dp0evaluator-service" && evaluator_service.exe"

timeout /t 1 /nobreak >nul

echo [2/4] Starting Python NLP Feedback Engine (:8081)...
start "Python NLP Service" cmd /c "cd /d "%~dp0nlp-service" && python server.py"

timeout /t 1 /nobreak >nul

echo [3/4] Starting Node.js API Gateway (:5000)...
start "Node Gateway" cmd /c "cd /d "%~dp0backend" && node src/server.js"

timeout /t 1 /nobreak >nul

echo [4/4] Starting React Frontend (:3000)...
start "React Frontend" cmd /c "cd /d "%~dp0frontend" && node ./node_modules/vite/bin/vite.js"

echo ========================================================
echo   All 4 Platform Services Launched Successfully!
echo   - Frontend:    http://localhost:3000
echo   - Node API:    http://localhost:5000
echo   - Swagger Docs:http://localhost:5000/api/docs
echo   - Python NLP:  http://localhost:8081/health
echo   - C++ Engine:  http://localhost:8082/health
echo ========================================================
