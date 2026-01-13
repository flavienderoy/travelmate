# Script de configuration Firebase automatique

Write-Host "🔥 Configuration Firebase automatique..." -ForegroundColor Green

# Aller dans le dossier racine
Set-Location C:\DEV\travelmate

Write-Host "📝 Copie des fichiers de configuration..." -ForegroundColor Yellow

# Copier les fichiers d'environnement
Copy-Item "backend/env.local" "backend/.env" -Force
Copy-Item "frontend/env.local" "frontend/.env" -Force

Write-Host "✅ Configuration Firebase mise à jour !" -ForegroundColor Green

Write-Host "🚀 Redémarrage de l'application..." -ForegroundColor Cyan

# Démarrer l'application
npm run dev

