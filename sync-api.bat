@echo off
setlocal

:: 1. DEFINITION DU CHEMIN VERS TON JDK INTELLIJ
set "JAVA_HOME=C:\Users\I52174\.jdks\jdk-21.0.5"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo ======================================================
echo VERIFICATION DE LA VERSION JAVA
echo ======================================================
java -version
if %errorlevel% neq 0 (
    echo.
    echo ERREUR : Le JDK n'a pas ete trouve dans :
    echo %JAVA_HOME%
    echo Verifie que le dossier existe bien.
    pause
    exit /b 1
)

echo.
echo ======================================================
echo DEBUT DE LA SYNCHRONISATION
echo ======================================================

:: Synchronisation du Frontend principal
echo [1/2] Synchronisation de FRONTEND...
cd frontend
call npm run api:sync
if %errorlevel% neq 0 (
    echo Erreur sur le projet Frontend.
    pause
    exit /b %errorlevel%
)

:: Retour au dossier parent et synchro Admin
echo.
echo [2/2] Synchronisation de ADMIN...
cd ..\admin
call npm run api:sync
if %errorlevel% neq 0 (
    echo Erreur sur le projet Admin.
    pause
    exit /b %errorlevel%
)

cd ..
echo.
echo ======================================================
echo SYNCHRONISATION REUSSIE !
echo ======================================================
pause
endlocal
