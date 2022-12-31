@echo off
title The Streamer.bot Actions .bat/.vbs build script
echo [46m[36m==============================================================[0m
echo [40m[36m  Welcome to the Streamer.bot Actions .bat/.vbs build script  [0m
echo [46m[36m==============================================================[0m
echo.
set /p "actionName=[0mEnter the action's name: [32m" || set "actionName=actionName"
set /p "fileName=[0mEnter your desired file name: [32m" || set "fileName=actionName"
echo.
echo node _action.cjs %actionName% >> %fileName%.bat
echo CreateObject("WScript.Shell").Run "node _action.cjs %actionName%", 0 >> %fileName%.vbs
echo.