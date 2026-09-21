@echo off
:: FinFlow Pro - Configurador de Dominio Local (finflow.local)
title FinFlow Pro - Configurar Dominio Local

:: Verifica privilegios de Administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Solicitando permissoes de Administrador para atualizar o arquivo hosts...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

set HOSTS_FILE=%WINDIR%\System32\drivers\etc\hosts

echo ========================================================
echo   FinFlow Pro - Configuracao do Dominio finflow.local
echo ========================================================
echo.
echo Arquivo de hosts: %HOSTS_FILE%
echo.

findstr /i "finflow.local" "%HOSTS_FILE%" >nul
if %errorlevel% equ 0 (
    echo [OK] O dominio finflow.local ja esta configurado no seu arquivo hosts!
) else (
    echo [ADICIONANDO] Mapeando 127.0.0.1 para finflow.local...
    echo. >> "%HOSTS_FILE%"
    echo # FinFlow Pro - Dominio Local >> "%HOSTS_FILE%"
    echo 127.0.0.1 finflow.local >> "%HOSTS_FILE%"
    echo 127.0.0.1 api.finflow.local >> "%HOSTS_FILE%"
    echo [SUCESSO] Entradas adicionadas ao arquivo hosts com sucesso!
)

echo.
echo ========================================================
echo Agora voce pode acessar a aplicacao por:
echo   - Frontend: http://finflow.local:5173
echo   - Backend API: http://finflow.local:8000/docs
echo ========================================================
echo.
pause
