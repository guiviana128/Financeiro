@echo off
title FinFlow Pro - Inicializador
echo ========================================================
echo   Iniciando FinFlow Pro (Backend Python + Frontend React)
echo ========================================================
echo.

echo [1/2] Iniciando Backend FastAPI (Porta 8000)...
start "FinFlow Pro - Backend API" cmd /k "py -3.11 backend/run.py"

echo [2/2] Iniciando Frontend React Vite (Porta 5173)...
start "FinFlow Pro - Frontend React" cmd /k "cd frontend && npm run dev"

echo.
echo Tudo pronto! O sistema abrira em seu navegador padrao.
timeout /t 3 > nul
start http://localhost:5173
exit
