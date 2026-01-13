# Script de correction rapide .env

Write-Host "🔧 Correction du fichier .env frontend..." -ForegroundColor Green

Set-Location C:\DEV\travelmate\frontend

# Copier env.local vers .env
Copy-Item "env.local" ".env" -Force

Write-Host "✅ Fichier .env créé avec les bonnes valeurs" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Contenu du fichier .env :" -ForegroundColor Yellow
Get-Content ".env"
Write-Host ""
Write-Host "🚀 Veuillez REDÉMARRER le serveur frontend maintenant !" -ForegroundColor Cyan
Write-Host "Appuyez sur Ctrl+C dans le terminal frontend, puis relancez: npm run dev" -ForegroundColor White

