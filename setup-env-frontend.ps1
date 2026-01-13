# Script pour créer le fichier .env frontend

Write-Host "🔧 Création du fichier .env frontend..." -ForegroundColor Green

Set-Location C:\DEV\travelmate\frontend

# Vérifier si env.local existe
if (Test-Path "env.local") {
    Write-Host "✅ Fichier env.local trouvé" -ForegroundColor Green
    
    # Copier env.local vers .env
    Copy-Item "env.local" ".env" -Force
    
    Write-Host "✅ Fichier .env créé avec succès !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Contenu du fichier .env :" -ForegroundColor Yellow
    Get-Content ".env"
    Write-Host ""
    Write-Host "⚠️  IMPORTANT : Redémarrez le serveur frontend pour que les changements prennent effet !" -ForegroundColor Red
    Write-Host "   Ctrl+C dans le terminal frontend, puis: npm run dev" -ForegroundColor White
} else {
    Write-Host "❌ Fichier env.local non trouvé !" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Création d'un fichier .env depuis env.example..." -ForegroundColor Yellow
    
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env" -Force
        Write-Host "✅ Fichier .env créé depuis env.example" -ForegroundColor Green
        Write-Host "⚠️  N'oubliez pas de remplir les valeurs dans .env !" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Aucun fichier d'exemple trouvé" -ForegroundColor Red
    }
}

