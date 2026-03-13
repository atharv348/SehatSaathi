@echo off
REM ArogyaMitra - Start New React Frontend
echo.
echo ========================================
echo   ArogyaMitra - React Frontend
echo   Modern Health Dashboard
echo ========================================
echo.
echo Starting React development server...
echo.

cd react-frontend
start cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ✓ React frontend starting on http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
