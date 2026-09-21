@echo off
title FinFlow Pro - Acesso no Celular e Internet
cd /d "%~dp0"
echo ========================================================
echo   FinFlow Pro - Servidor de Alta Performance (Celular/PC)
echo ========================================================
echo.

echo [1/3] Iniciando Backend FastAPI (Porta 8000)...
start "FinFlow Pro - Backend API" cmd /k "cd /d "%~dp0" && py -3.11 backend/run.py"

echo [2/3] Otimizando Frontend para carregamento instantaneo...
cd /d "%~dp0\frontend"
call npm run build
start "FinFlow Pro - Frontend Preview" cmd /k "cd /d "%~dp0\frontend" && npm run preview"

echo.
echo Aguardando inicializacao...
timeout /t 3 > nul

echo.
echo ========================================================
echo [OPCAO 1 - RECOMENDADA] NO MESMO WI-FI (SUPER RAPIDO):
echo   Abra no celular: http://192.168.15.9:5173
echo ========================================================
echo.
echo [OPCAO 2] FORA DE CASA (INTERNET 4G/5G):
echo   Criando tunel HTTPS...
echo ========================================================
echo.
ssh -o StrictHostKeyChecking=no -R 80:localhost:5173 nokey@localhost.run
pause
