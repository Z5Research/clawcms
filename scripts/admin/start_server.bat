@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   ClawCMS 管理后台 v2.0 - 启动脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [信息] 正在启动本地服务器...
echo [信息] 访问地址：http://localhost:8080
echo [提示] 按 Ctrl+C 停止服务器
echo.

python -m http.server 8080

pause
