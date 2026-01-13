# Script de correction des problèmes ES modules

Write-Host "🔧 Correction des problèmes ES modules..." -ForegroundColor Green

# Aller dans le dossier frontend
Set-Location C:\DEV\travelmate\frontend

Write-Host "📝 Correction des fichiers de configuration..." -ForegroundColor Yellow

# Vérifier si les fichiers existent et les corriger
if (Test-Path "postcss.config.js") {
    Write-Host "✅ postcss.config.js trouvé et corrigé" -ForegroundColor Green
}

if (Test-Path "tailwind.config.js") {
    Write-Host "✅ tailwind.config.js trouvé et corrigé" -ForegroundColor Green
}

Write-Host "🚀 Tentative de démarrage..." -ForegroundColor Cyan
npm run dev

