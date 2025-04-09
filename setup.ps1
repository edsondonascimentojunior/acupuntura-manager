# setup.ps1 - Script de instalação automática para Windows

Write-Host ' Iniciando o setup do projeto...'

# Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error 'Node.js nao esta instalado. Instale-o em: https://nodejs.org/'
    exit 1
}

# Backend setup
Write-Host ' Instalando dependencias do backend...'
cd .\backend
npm install

Write-Host ' Aplicando migracoes do banco de dados...'
npx prisma migrate dev --name init

# Frontend setup
Write-Host ' Instalando dependencias do frontend...'
cd ..\frontend
npm install

Write-Host ' Instalacao concluida!'

Write-Host '`n Comandos uteis:'
Write-Host '  - Rodar backend: cd backend; npm run dev'
Write-Host '  - Rodar frontend: cd frontend; npm run dev'
Write-Host '  - Banco de dados: backend/prisma/dev.db'

pause
