# Diagnostic Firebase TravelMate

Write-Host "🔍 Diagnostic Firebase TravelMate..." -ForegroundColor Green

Write-Host ""
Write-Host "📋 Fichiers critiques à vérifier :" -ForegroundColor Yellow

# Vérifier le fichier .env frontend
Write-Host "1. frontend/.env" -ForegroundColor Cyan
if (Test-Path "frontend/.env") {
    $envContent = Get-Content "frontend/.env"
    $apiKey = $envContent | Where-Object { $_ -match "VITE_FIREBASE_API_KEY" }
    if ($apiKey) {
        Write-Host "   ✅ Fichier .env existe" -ForegroundColor Green
        Write-Host "   🔑 Clé API: $($apiKey.Split('=')[1].Substring(0,10))..." -ForegroundColor White
    } else {
        Write-Host "   ❌ Clé API Firebase manquante" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Fichier .env manquant" -ForegroundColor Red
}

# Vérifier le fichier .env backend
Write-Host "2. backend/.env" -ForegroundColor Cyan
if (Test-Path "backend/.env") {
    Write-Host "   ✅ Fichier .env existe" -ForegroundColor Green
} else {
    Write-Host "   ❌ Fichier .env manquant" -ForegroundColor Red
}

# Vérifier AuthContext.jsx
Write-Host "3. frontend/src/contexts/AuthContext.jsx" -ForegroundColor Cyan
if (Test-Path "frontend/src/contexts/AuthContext.jsx") {
    $authContent = Get-Content "frontend/src/contexts/AuthContext.jsx"
    if ($authContent -match "initializeApp") {
        Write-Host "   ✅ Firebase initialisé" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Firebase non initialisé" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Fichier AuthContext.jsx manquant" -ForegroundColor Red
}

Write-Host ""
Write-Host "🚀 Actions recommandées :" -ForegroundColor Yellow
Write-Host "1. Aller sur https://console.firebase.google.com/" -ForegroundColor White
Write-Host "2. Sélectionner le projet 'travelmate-ynov'" -ForegroundColor White
Write-Host "3. Project Settings > Your apps > Web app" -ForegroundColor White
Write-Host "4. Copier la configuration Firebase" -ForegroundColor White
Write-Host "5. Mettre à jour frontend/.env avec la vraie clé API" -ForegroundColor White

