@echo off
cd /d "%~dp0"
echo ArtFilter 本地服务器启动中...
echo 打开浏览器访问: http://localhost:8080
echo 按 Ctrl+C 停止
echo.
python -m http.server 8080
pause
