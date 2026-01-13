# Script de test du backend

Write-Host "🔧 Test du backend TravelMate..." -ForegroundColor Green

# Aller dans le dossier backend
Set-Location C:\DEV\travelmate\backend

Write-Host "📝 Copie du fichier d'environnement..." -ForegroundColor Yellow
Copy-Item "env.local" ".env" -Force

Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

Write-Host "🚀 Démarrage du backend..." -ForegroundColor Cyan
npm run dev

