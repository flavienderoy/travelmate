# Script de démarrage complet TravelMate

Write-Host "🚀 Démarrage complet TravelMate..." -ForegroundColor Green

# Aller dans le dossier racine
Set-Location C:\DEV\travelmate

Write-Host "📝 Configuration des fichiers d'environnement..." -ForegroundColor Yellow

# Copier les fichiers d'environnement
Copy-Item "backend/env.local" "backend/.env" -Force
Copy-Item "frontend/env.local" "frontend/.env" -Force

Write-Host "✅ Configuration terminée !" -ForegroundColor Green

Write-Host "🚀 Démarrage de l'application..." -ForegroundColor Cyan
Write-Host "Backend: http://localhost:3001" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""

# Démarrer l'application
npm run dev

