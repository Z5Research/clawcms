@echo off
echo Starting CCLI Prototype Server...
echo.
echo Open in browser: http://localhost:8080
echo.
echo Press Ctrl+C to stop
echo.
cd /d E:\ccli\prototype
python -m http.server 8080
