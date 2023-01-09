Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope Process
if (get-package nodejs* | % { $_.metadata['C:\Program Files'] }) {
    node \\bin\\server.js
}
else {
    winget install Node.js
    node \\bin\\server.js
}

