@echo off
title FinFlow Pro - Dominio Publico (Ngrok)
cd /d "%~dp0"
echo ========================================================
echo   FinFlow Pro - Servidor com Dominio Publico Oficial
echo ========================================================
echo.

echo [1/3] Iniciando Backend FastAPI (Porta 8000)...
start "FinFlow Pro - Backend API" cmd /k "cd /d "%~dp0" && py -3.11 backend/run.py"

echo [2/3] Iniciando Frontend React Otimizado (Porta 5173)...
start "FinFlow Pro - Frontend Preview" cmd /k "cd /d "%~dp0\frontend" && npm run preview"

echo.
echo Aguardando inicializacao dos servicos...
timeout /t 3 > nul

echo.
echo [3/3] Iniciando Dominio Publico Ngrok...
echo ========================================================
echo Seu dominio fixo oficial: https://huddling-bronzing-linked.ngrok-free.dev
echo ========================================================
echo.
npx -y ngrok http 5173
pause
