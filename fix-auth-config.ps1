# Guide de résolution auth/configuration-not-found

Write-Host "🔧 Résolution de l'erreur auth/configuration-not-found" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Checklist de configuration Firebase :" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. ✅ Activer Google Sign-In dans Firebase Console :" -ForegroundColor Cyan
Write-Host "   - Aller sur https://console.firebase.google.com/" -ForegroundColor White
Write-Host "   - Sélectionner le projet 'travelmate-ynov'" -ForegroundColor White
Write-Host "   - Authentication > Sign-in method" -ForegroundColor White
Write-Host "   - Activer Google" -ForegroundColor White
Write-Host ""

Write-Host "2. ✅ Vérifier les domaines autorisés :" -ForegroundColor Cyan
Write-Host "   - Authentication > Settings > Authorized domains" -ForegroundColor White
Write-Host "   - Vérifier que 'localhost' est présent" -ForegroundColor White
Write-Host ""

Write-Host "3. ✅ Vérifier la clé API dans Google Cloud Console :" -ForegroundColor Cyan
Write-Host "   - Aller sur https://console.cloud.google.com/" -ForegroundColor White
Write-Host "   - Sélectionner le projet 'travelmate-ynov'" -ForegroundColor White
Write-Host "   - APIs & Services > Credentials" -ForegroundColor White
Write-Host "   - Vérifier que l'API Key a bien 'AIzaSyBa_0guO0p3caxmFze11bLJSt8BLRWN9sg'" -ForegroundColor White
Write-Host "   - Si pas de restriction, ajouter 'localhost' dans les restrictions HTTP" -ForegroundColor White
Write-Host ""

Write-Host "4. ✅ Activer les APIs nécessaires :" -ForegroundColor Cyan
Write-Host "   - APIs & Services > Library" -ForegroundColor White
Write-Host "   - Activer 'Identity Toolkit API'" -ForegroundColor White
Write-Host "   - Activer 'Firebase Authentication API'" -ForegroundColor White
Write-Host ""

Write-Host "🚀 Après ces étapes, testez à nouveau la connexion Google !" -ForegroundColor Green

