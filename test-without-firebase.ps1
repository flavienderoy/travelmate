# Test de l'application sans Firebase

Write-Host "🧪 Test de TravelMate sans Firebase..." -ForegroundColor Green

# Aller dans le dossier racine
Set-Location C:\DEV\travelmate

Write-Host "📝 Configuration des fichiers d'environnement..." -ForegroundColor Yellow

# Copier les fichiers d'environnement
Copy-Item "backend/env.local" "backend/.env" -Force
Copy-Item "frontend/env.local" "frontend/.env" -Force

Write-Host "✅ Configuration terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Démarrage de l'application en mode test..." -ForegroundColor Cyan
Write-Host "Backend: http://localhost:3001" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "📋 Fonctionnalités disponibles :" -ForegroundColor Yellow
Write-Host "- ✅ Interface utilisateur" -ForegroundColor Green
Write-Host "- ✅ Navigation entre pages" -ForegroundColor Green
Write-Host "- ✅ Formulaires de création" -ForegroundColor Green
Write-Host "- ✅ API backend (simulée)" -ForegroundColor Green
Write-Host "- ⚠️ Authentification simulée" -ForegroundColor Yellow
Write-Host "- ⚠️ Base de données simulée" -ForegroundColor Yellow
Write-Host ""

# Démarrer l'application
npm run dev

