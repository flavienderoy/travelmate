# deploy-aws-backend.ps1
# Script de déploiement pour le Backend TravelMate sur AWS ECR

param(
    [string]$Region = "eu-west-1",
    [string]$AccountId = "",
    [string]$RepositoryName = "travelmate-backend"
)

Write-Host "🚀 Début du déploiement Backend vers AWS ECR..." -ForegroundColor Green

# 1. Vérifications Préalables
if (-not (Get-Command "docker" -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Docker n'est pas installé ou n'est pas dans le PATH."
    exit 1
}
if (-not (Get-Command "aws" -ErrorAction SilentlyContinue)) {
    Write-Error "❌ AWS CLI n'est pas installé ou n'est pas dans le PATH."
    exit 1
}

# Récupérer l'Account ID si non fourni
if ([string]::IsNullOrEmpty($AccountId)) {
    Write-Host "🔍 Récupération de l'AWS Account ID..." -ForegroundColor Yellow
    try {
        $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
        $AccountId = $identity.Account
        Write-Host "✅ Account ID trouvé : $AccountId" -ForegroundColor Cyan
    }
    catch {
        Write-Error "❌ Impossible de récupérer l'AWS Account ID. Vérifiez 'aws configure'."
        exit 1
    }
}

$EcrUri = "$AccountId.dkr.ecr.$Region.amazonaws.com"
$ImageFullName = "$EcrUri/$RepositoryName"

# 2. Authentification ECR
Write-Host "🔐 Authentification auprès d'AWS ECR..." -ForegroundColor Yellow
try {
    aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $EcrUri
    if ($LASTEXITCODE -ne 0) { throw "Echec login docker" }
    Write-Host "✅ Login Docker réussi !" -ForegroundColor Green
}
catch {
    Write-Error "❌ Échec de l'authentification ECR. Vérifiez vos droits AWS."
    exit 1
}

# 3. Création du Repository (si inexistant)
Write-Host "📦 Vérification du repository ECR '$RepositoryName'..." -ForegroundColor Yellow
$repoExists = aws ecr describe-repositories --repository-names $RepositoryName --region $Region 2>$null
if (-not $repoExists) {
    Write-Host "✨ Création du repository '$RepositoryName'..." -ForegroundColor Cyan
    aws ecr create-repository --repository-name $RepositoryName --region $Region
} else {
    Write-Host "✅ Repository distant existant." -ForegroundColor Green
}

# 4. Build de l'image
Write-Host "🔨 Construction de l'image Docker..." -ForegroundColor Yellow
Set-Location "backend" 
# On suppose que le script est lancé depuis la racine, donc on descend dans backend/
# Mais si on est déjà dans backend, ajustez. Le Dockerfile est dans backend/Dockerfile.
# Le contexte de build doit être le dossier backend local.

# Vérifions où nous sommes
if (Test-Path "Dockerfile") {
    # On est déjà dans backend
    docker build -t $RepositoryName .
} elseif (Test-Path "backend/Dockerfile") {
    # On est à la racine
    docker build -t $RepositoryName ./backend
} else {
    Write-Error "❌ Dockerfile introuvable (cherché dans ./Dockerfile et ./backend/Dockerfile)."
    exit 1
}

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Erreur lors du build Docker."
    exit 1
}
Write-Host "✅ Build terminé." -ForegroundColor Green

# 5. Tag de l'image
Write-Host "🏷️ Tag de l'image..." -ForegroundColor Yellow
docker tag "$RepositoryName`:latest" "$ImageFullName`:latest"

# 6. Push vers ECR
Write-Host "⬆️ Push de l'image vers ECR ($ImageFullName)..." -ForegroundColor Yellow
docker push "$ImageFullName`:latest"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ SUCCÈS ! L'image backend est en ligne sur ECR." -ForegroundColor Green
    Write-Host "URi de l'image : $ImageFullName`:latest" -ForegroundColor White
    Write-Host ""
    Write-Host "👉 Prochaine étape : Aller sur AWS App Runner ou ECS et déployer cette image." -ForegroundColor Cyan
} else {
    Write-Error "❌ Erreur lors du push vers ECR."
    exit 1
}
