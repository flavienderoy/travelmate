# Script de correction backend

Write-Host "🔧 Correction des problèmes backend..." -ForegroundColor Green

# Aller dans le dossier backend
Set-Location C:\DEV\travelmate\backend

Write-Host "📦 Mise à jour des dépendances..." -ForegroundColor Yellow

# Nettoyer et réinstaller
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

Write-Host "📦 Installation des dépendances mises à jour..." -ForegroundColor Yellow
npm install

Write-Host "📝 Copie du fichier d'environnement..." -ForegroundColor Yellow
Copy-Item "env.local" ".env" -Force

Write-Host "✅ Backend configuré !" -ForegroundColor Green

Write-Host "🚀 Démarrage du backend..." -ForegroundColor Cyan
npm run dev

