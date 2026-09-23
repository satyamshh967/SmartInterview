@echo off
echo Compiling C++ Code Evaluation Engine...
g++ -std=c++20 -O2 src/main.cpp -lws2_32 -lpsapi -o evaluator_service.exe
if %ERRORLEVEL% EQU 0 (
    echo Compilation succeeded! evaluator_service.exe created.
) else (
    echo Compilation failed with error %ERRORLEVEL%
)
