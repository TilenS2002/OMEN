Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope Process
if (node -v) {
    node .\bin\server.js
}
else {
    winget install Node.js
    node .\bin\server.js
}

