@echo off
echo =========================================
echo   NOVO AMANHECER - Iniciar Servidor
echo =========================================
echo.

echo [1/4] Parando todos os processos Node.js...
taskkill /F /IM node.exe /T 2>nul
timeout /t 3 /nobreak >nul

echo [2/4] Limpando porta 3000...
timeout /t 2 /nobreak >nul

echo [3/4] Verificando se a porta esta livre...
netstat -ano | findstr :3000

echo [4/4] Iniciando servidor...
echo.
cd api
node index.js

pause


