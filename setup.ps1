# Configuration automatique TravelMate pour Windows

Write-Host "🚀 Configuration automatique TravelMate..." -ForegroundColor Green

# Copier les fichiers d'environnement
Write-Host "📝 Configuration des variables d'environnement..." -ForegroundColor Yellow
Copy-Item "backend/env.local" "backend/.env"
Copy-Item "frontend/env.local" "frontend/.env"

Write-Host "✅ Variables d'environnement configurées" -ForegroundColor Green

# Installer les dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install
Set-Location backend
npm install
Set-Location ../frontend
npm install
Set-Location ..

Write-Host "✅ Dépendances installées" -ForegroundColor Green

Write-Host "🎉 Configuration terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "Pour démarrer l'application :" -ForegroundColor Cyan
Write-Host "npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Ou séparément :" -ForegroundColor Cyan
Write-Host "Terminal 1: cd backend && npm run dev" -ForegroundColor White
Write-Host "Terminal 2: cd frontend && npm run dev" -ForegroundColor White

