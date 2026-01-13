# Script de création du fichier .env

Write-Host "🔧 Création du fichier .env frontend..." -ForegroundColor Green

Set-Location C:\DEV\travelmate\frontend

# Créer le contenu du fichier .env
$envContent = @"
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=AIzaSyBa_0guO0p3caxmFze11bLJSt8BLRWN9sg
VITE_FIREBASE_AUTH_DOMAIN=travelmate-ynov.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=travelmate-ynov
VITE_FIREBASE_STORAGE_BUCKET=travelmate-ynov.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=148242971237
VITE_FIREBASE_APP_ID=1:148242971237:web:f482c16d3be70cefb5648c
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBa_0guO0p3caxmFze11bLJSt8BLRWN9sg
"@

# Écrire le fichier
$envContent | Out-File -FilePath ".env" -Encoding UTF8 -NoNewline

Write-Host "✅ Fichier .env créé avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "📄 Contenu du fichier .env :" -ForegroundColor Yellow
Get-Content ".env"
Write-Host ""
Write-Host "🚨 IMPORTANT : Redémarrez le serveur Vite maintenant !" -ForegroundColor Red
Write-Host "   1. Arrêtez le serveur (Ctrl+C)" -ForegroundColor White
Write-Host "   2. Redémarrez : npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Vite ne charge les variables qu'au démarrage !" -ForegroundColor Yellow

