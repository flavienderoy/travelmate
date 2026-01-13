# Script de résolution des problèmes d'installation

Write-Host "🔧 Résolution des problèmes d'installation TravelMate..." -ForegroundColor Green

# Aller dans le dossier racine
Set-Location C:\DEV\travelmate

Write-Host "📦 Installation des dépendances racine..." -ForegroundColor Yellow
npm install

Write-Host "📦 Installation des dépendances backend..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

Write-Host "✅ Toutes les dépendances installées !" -ForegroundColor Green

Write-Host "🚀 Démarrage de l'application..." -ForegroundColor Cyan
npm run dev

