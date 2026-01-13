# Script de correction Firebase frontend

Write-Host "🔥 Correction Firebase frontend..." -ForegroundColor Green

# Aller dans le dossier frontend
Set-Location C:\DEV\travelmate\frontend

Write-Host "📝 Copie du fichier d'environnement..." -ForegroundColor Yellow
Copy-Item "env.local" ".env" -Force

Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

Write-Host "🚀 Démarrage du frontend..." -ForegroundColor Cyan
npm run dev

