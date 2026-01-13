# Script de déploiement AWS pour le frontend

param(
    [string]$BucketName = "travelmate-frontend",
    [string]$DistributionId = "",
    [switch]$SkipBuild = $false
)

Write-Host "🚀 Déploiement Frontend sur AWS" -ForegroundColor Green
Write-Host ""

# Aller dans le dossier frontend
Set-Location C:\DEV\travelmate\frontend

# Build du projet
if (-not $SkipBuild) {
    Write-Host "🔨 Building frontend..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors du build" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Build terminé" -ForegroundColor Green
    Write-Host ""
}

# Vérifier que le dossier dist existe
if (-not (Test-Path "dist")) {
    Write-Host "❌ Le dossier dist/ n'existe pas. Lancez d'abord npm run build" -ForegroundColor Red
    exit 1
}

# Déployer sur S3
Write-Host "📦 Déploiement sur S3..." -ForegroundColor Yellow
Write-Host "Bucket: $BucketName" -ForegroundColor White

aws s3 sync dist/ "s3://$BucketName/" --delete --exact-timestamps

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du déploiement S3" -ForegroundColor Red
    Write-Host "Vérifiez que:" -ForegroundColor Yellow
    Write-Host "  - AWS CLI est installé" -ForegroundColor White
    Write-Host "  - AWS CLI est configuré (aws configure)" -ForegroundColor White
    Write-Host "  - Le bucket $BucketName existe" -ForegroundColor White
    exit 1
}

Write-Host "✅ Fichiers déployés sur S3" -ForegroundColor Green
Write-Host ""

# Invalider CloudFront cache si DistributionId fourni
if ($DistributionId -ne "") {
    Write-Host "🔄 Invalidation du cache CloudFront..." -ForegroundColor Yellow
    Write-Host "Distribution ID: $DistributionId" -ForegroundColor White
    
    aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Cache CloudFront invalidé" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Erreur lors de l'invalidation (non bloquant)" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "✅ Déploiement terminé avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 URL du site:" -ForegroundColor Cyan
Write-Host "  S3: http://$BucketName.s3-website-eu-west-1.amazonaws.com" -ForegroundColor White
if ($DistributionId -ne "") {
    Write-Host "  CloudFront: https://$(aws cloudfront get-distribution --id $DistributionId --query 'Distribution.DomainName' --output text)" -ForegroundColor White
}


