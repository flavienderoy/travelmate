# Script de diagnostic et correction complète

Write-Host "🔍 === DIAGNOSTIC COMPLET ===" -ForegroundColor Green

# Aller dans le dossier frontend
Set-Location C:\DEV\travelmate\frontend

Write-Host "1. Vérification des fichiers d'environnement..." -ForegroundColor Yellow

# Vérifier si .env existe
if (Test-Path ".env") {
    Write-Host "   ✅ .env existe" -ForegroundColor Green
    Write-Host "   📄 Contenu du .env :" -ForegroundColor Cyan
    Get-Content ".env" | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
} else {
    Write-Host "   ❌ .env n'existe PAS !" -ForegroundColor Red
    Write-Host "   🔧 Création du fichier .env..." -ForegroundColor Yellow
    
    if (Test-Path "env.local") {
        Copy-Item "env.local" ".env" -Force
        Write-Host "   ✅ .env créé depuis env.local" -ForegroundColor Green
    } else {
        Write-Host "   ❌ env.local n'existe pas non plus !" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "2. Vérification de la configuration Vite..." -ForegroundColor Yellow
if (Test-Path "vite.config.js") {
    Write-Host "   ✅ vite.config.js existe" -ForegroundColor Green
} else {
    Write-Host "   ❌ vite.config.js manquant" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Instructions importantes :" -ForegroundColor Yellow
Write-Host "   ⚠️  Après avoir créé .env, vous DEVEZ :" -ForegroundColor Red
Write-Host "   1. Arrêter le serveur Vite (Ctrl+C)" -ForegroundColor White
Write-Host "   2. Redémarrer avec: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   ⚠️  Vite charge les variables AU DÉMARRAGE uniquement !" -ForegroundColor Red

Write-Host ""
Write-Host "🚀 Pour redémarrer le serveur maintenant :" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White

