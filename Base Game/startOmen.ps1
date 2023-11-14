powershell.exe Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope Process
if (node -v) {
    Start-Process "http://localhost:3000/"
    node .\bin\server.js
}
else {
    winget install Node.js
    Start-Process "http://localhost:3000/"
    node .\bin\server.js
}