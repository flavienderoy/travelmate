# Script de mise à jour Firebase

Write-Host "🔥 Mise à jour de la configuration Firebase..." -ForegroundColor Green

Write-Host ""
Write-Host "📋 Instructions :" -ForegroundColor Yellow
Write-Host "1. Aller sur https://console.firebase.google.com/" -ForegroundColor White
Write-Host "2. Sélectionner le projet 'travelmate-ynov'" -ForegroundColor White
Write-Host "3. Cliquer sur l'icône ⚙️ (Settings) > Project settings" -ForegroundColor White
Write-Host "4. Scroller vers 'Your apps' et cliquer sur l'icône </>" -ForegroundColor White
Write-Host "5. Copier la configuration Firebase" -ForegroundColor White
Write-Host ""

# Demander à l'utilisateur de coller sa configuration
$apiKey = Read-Host "Collez votre VRAIE clé API Firebase (apiKey)"

if ($apiKey -and $apiKey -ne "") {
    Write-Host "📝 Mise à jour du fichier .env..." -ForegroundColor Yellow
    
    # Mettre à jour le fichier frontend/.env
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
    
    Set-Location C:\DEV\travelmate\frontend
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Host "✅ Configuration mise à jour !" -ForegroundColor Green
    Write-Host "🚀 Redémarrage du frontend..." -ForegroundColor Cyan
    
    npm run dev
} else {
    Write-Host "❌ Aucune clé API fournie. Veuillez réessayer." -ForegroundColor Red
}

