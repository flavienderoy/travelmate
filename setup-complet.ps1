# Guide de configuration complète TravelMate

Write-Host "🚀 Configuration complète TravelMate" -ForegroundColor Green
Write-Host ""

Write-Host "📋 ÉTAPE 1 : Configuration Firestore" -ForegroundColor Yellow
Write-Host "1. Aller sur https://console.firebase.google.com/" -ForegroundColor White
Write-Host "2. Sélectionner le projet 'travelmate-ynov'" -ForegroundColor White
Write-Host "3. Firestore Database > Créer une base de données" -ForegroundColor White
Write-Host "4. Mode test (pour le développement)" -ForegroundColor White
Write-Host "5. Région : europe-west1 (Belgium)" -ForegroundColor White
Write-Host ""

Write-Host "📋 ÉTAPE 2 : Déployer les règles de sécurité Firestore" -ForegroundColor Yellow
Write-Host "1. Aller dans Firestore > Règles" -ForegroundColor White
Write-Host "2. Copier les règles depuis frontend/firestore.rules" -ForegroundColor White
Write-Host "3. Ou utiliser ces règles de base :" -ForegroundColor White
Write-Host ""
Write-Host "   rules_version = '2';" -ForegroundColor Cyan
Write-Host "   service cloud.firestore {" -ForegroundColor Cyan
Write-Host "     match /databases/{database}/documents {" -ForegroundColor Cyan
Write-Host "       match /{document=**} {" -ForegroundColor Cyan
Write-Host "         allow read, write: if request.auth != null;" -ForegroundColor Cyan
Write-Host "       }" -ForegroundColor Cyan
Write-Host "     }" -ForegroundColor Cyan
Write-Host "   }" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Publier les règles" -ForegroundColor White
Write-Host ""

Write-Host "📋 ÉTAPE 3 : Configuration Google Maps API" -ForegroundColor Yellow
Write-Host "1. Aller sur https://console.cloud.google.com/" -ForegroundColor White
Write-Host "2. Sélectionner 'travelmate-ynov'" -ForegroundColor White
Write-Host "3. APIs & Services > Library" -ForegroundColor White
Write-Host "4. Activer ces APIs :" -ForegroundColor White
Write-Host "   - Maps JavaScript API" -ForegroundColor Cyan
Write-Host "   - Places API" -ForegroundColor Cyan
Write-Host "   - Directions API" -ForegroundColor Cyan
Write-Host "   - Geocoding API" -ForegroundColor Cyan
Write-Host "5. APIs & Services > Credentials" -ForegroundColor White
Write-Host "6. Créer une clé API ou utiliser celle existante" -ForegroundColor White
Write-Host "7. Mettre à jour frontend/.env avec VITE_GOOGLE_MAPS_API_KEY" -ForegroundColor White
Write-Host ""

Write-Host "📋 ÉTAPE 4 : Configuration du backend Firebase Admin" -ForegroundColor Yellow
Write-Host "1. Firebase Console > Project Settings > Service accounts" -ForegroundColor White
Write-Host "2. Générer une nouvelle clé privée" -ForegroundColor White
Write-Host "3. Télécharger le fichier JSON" -ForegroundColor White
Write-Host "4. Renommer en 'firebase-service-account.json'" -ForegroundColor White
Write-Host "5. Placer dans backend/" -ForegroundColor White
Write-Host ""

Write-Host "📋 ÉTAPE 5 : Tester l'application" -ForegroundColor Yellow
Write-Host "1. Redémarrer le backend : cd backend && npm run dev" -ForegroundColor White
Write-Host "2. Redémarrer le frontend : cd frontend && npm run dev" -ForegroundColor White
Write-Host "3. Tester la connexion Google" -ForegroundColor White
Write-Host "4. Tester la création d'un voyage" -ForegroundColor White
Write-Host "5. Vérifier dans Firestore que les données sont créées" -ForegroundColor White
Write-Host ""

Write-Host "✅ Configuration terminée !" -ForegroundColor Green

