# Configuration Firebase avec vos vraies données

Write-Host "🔥 Configuration Firebase avec vos données..." -ForegroundColor Green

# Demander la clé API Web
Write-Host ""
Write-Host "📋 Vous devez d'abord obtenir votre clé API Web :" -ForegroundColor Yellow
Write-Host "1. Aller sur https://console.cloud.google.com/" -ForegroundColor White
Write-Host "2. Sélectionner le projet 'travelmate-ynov'" -ForegroundColor White
Write-Host "3. APIs & Services > Credentials" -ForegroundColor White
Write-Host "4. Create Credentials > API Key" -ForegroundColor White
Write-Host "5. Copier la clé API générée" -ForegroundColor White
Write-Host ""

$apiKey = Read-Host "Collez votre clé API Web Firebase"

if ($apiKey -and $apiKey -ne "") {
    Write-Host "📝 Création du fichier .env..." -ForegroundColor Yellow
    
    # Configuration complète
    $envContent = @"
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=$apiKey
VITE_FIREBASE_AUTH_DOMAIN=travelmate-ynov.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=travelmate-ynov
VITE_FIREBASE_STORAGE_BUCKET=travelmate-ynov.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=148242971237
VITE_FIREBASE_APP_ID=1:148242971237:web:f482c16d3be70cefb5648c
VITE_GOOGLE_MAPS_API_KEY=$apiKey
"@
    
    # Aller dans le dossier frontend
    Set-Location C:\DEV\travelmate\frontend
    
    # Créer le fichier .env
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Host "✅ Fichier .env créé avec votre configuration !" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Démarrage du frontend..." -ForegroundColor Cyan
    npm run dev
} else {
    Write-Host "❌ Aucune clé API fournie." -ForegroundColor Red
    Write-Host "Veuillez suivre les instructions ci-dessus pour obtenir votre clé API." -ForegroundColor Yellow
}

