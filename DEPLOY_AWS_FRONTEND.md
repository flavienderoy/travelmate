# 🚀 Guide de déploiement Frontend sur AWS (S3 + CloudFront)

## 📋 À propos du Dockerfile

### **Le Dockerfile actuel (`backend/Dockerfile`)**
- **Utilité** : Containerise le backend Node.js/Express
- **Pourquoi** : Permet de déployer le backend de manière portable et scalable
- **Où l'utiliser** : 
  - **AWS ECS/Fargate** : Pour déployer le backend en containers
  - **AWS App Runner** : Service serverless de containers
  - **Cloud Run (GCP)** : Alternative GCP pour containers
  - **Tests locaux** : Tester l'environnement de production

### **Pas de Dockerfile pour le frontend ?**
Pour un frontend React/Vite, vous avez **2 options** :

1. **Déploiement statique (S3 + CloudFront)** ⭐ **Recommandé**
   - Le build Vite génère des fichiers statiques (HTML, CSS, JS)
   - S3 héberge les fichiers
   - CloudFront fait le CDN
   - Pas besoin de Docker

2. **Container (si vraiment nécessaire)**
   - Serveur web (nginx) pour servir les fichiers statiques
   - Utile si vous avez besoin de SSR (Server-Side Rendering)

---

## 🎯 Déploiement Frontend sur AWS (S3 + CloudFront)

### **Architecture**
```
Vite Build → S3 Bucket → CloudFront CDN → Utilisateurs
```

---

## 📋 Étapes de déploiement

### **1. Prérequis**

1. **AWS CLI installé** :
   ```powershell
   # Vérifier
   aws --version
   
   # Si pas installé, installer
   # Télécharger depuis https://aws.amazon.com/cli/
   ```

2. **AWS CLI configuré** :
   ```powershell
   aws configure
   # Entrer :
   # - AWS Access Key ID
   # - AWS Secret Access Key
   # - Region (ex: eu-west-1 pour Paris)
   # - Output format (json)
   ```

3. **Build du frontend** :
   ```powershell
   cd frontend
   npm run build
   # Crée le dossier dist/ avec les fichiers statiques
   ```

---

### **2. Créer un bucket S3**

1. **Aller sur AWS Console** : https://console.aws.amazon.com/s3/
2. **Créer un bucket** :
   - Nom : `travelmate-frontend` (ou autre, doit être unique globalement)
   - Région : `eu-west-1` (Europe - Paris)
   - Bloquer l'accès public : **DÉSACTIVÉ** (pour CloudFront)
   - Bloquer l'accès public via les ACLs : **DÉSACTIVÉ**

3. **Configurer le bucket pour l'hébergement statique** :
   - Onglet **Properties** > **Static website hosting**
   - Activer
   - Index document : `index.html`
   - Error document : `index.html` (pour SPA)

4. **Permissions du bucket** :
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::travelmate-frontend/*"
       }
     ]
   }
   ```

---

### **3. Déployer les fichiers sur S3**

**Option A : Via AWS CLI** (recommandé)

```powershell
cd frontend

# Build du projet
npm run build

# Déployer sur S3
aws s3 sync dist/ s3://travelmate-frontend --delete

# Ou avec le script npm
npm run deploy:aws
# (Modifier le nom du bucket dans package.json avant)
```

**Option B : Via Console AWS**
- Aller dans le bucket
- Cliquer **Upload**
- Glisser-déposer tout le contenu de `frontend/dist/`

---

### **4. Configurer CloudFront (CDN)**

1. **Aller sur AWS CloudFront** : https://console.aws.amazon.com/cloudfront/
2. **Créer une distribution** :
   - **Origin** : Sélectionner le bucket S3
   - **Origin Access** : Origin access control (OAC) recommended
   - **Viewer Protocol Policy** : Redirect HTTP to HTTPS
   - **Allowed HTTP Methods** : GET, HEAD, OPTIONS
   - **Default Root Object** : `index.html`
   - **Error Pages** :
     - HTTP Error Code : `403`
     - Response Page Path : `/index.html`
     - HTTP Response Code : `200`
     - Répéter pour `404`

3. **Configurer les variables d'environnement** :
   - **Origin** > Edit
   - Ajouter des headers personnalisés pour les variables d'environnement
   - OU utiliser **CloudFront Functions** pour injecter les variables

---

### **5. Variables d'environnement sur AWS**

**Problème** : `.env` ne fonctionne pas sur S3 (fichiers statiques)

**Solutions** :

#### **Solution 1 : CloudFront Functions** (Simple)

Créer une fonction CloudFront pour injecter les variables :

```javascript
function handler(event) {
    var response = event.response;
    var html = response.body;
    
    // Remplacer les placeholders par les vraies valeurs
    html = html.replace(/VITE_API_URL_PLACEHOLDER/g, 'https://votre-backend-url.com');
    html = html.replace(/VITE_FIREBASE_API_KEY_PLACEHOLDER/g, 'votre-vraie-cle');
    
    response.body = html;
    return response;
}
```

#### **Solution 2 : Script de build avec variables** (Recommandé)

Créer un script qui remplace les variables avant le build :

```javascript
// scripts/inject-env.js
import { readFileSync, writeFileSync } from 'fs';

const env = {
  VITE_API_URL: process.env.VITE_API_URL || 'https://votre-backend.com',
  VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
  // ...
};

const html = readFileSync('dist/index.html', 'utf-8');
const updatedHtml = Object.entries(env).reduce((acc, [key, value]) => {
  return acc.replace(new RegExp(`%${key}%`, 'g'), value);
}, html);

writeFileSync('dist/index.html', updatedHtml);
```

#### **Solution 3 : Utiliser AWS Systems Manager Parameter Store**

Stocker les variables dans AWS Parameter Store et les injecter via CloudFront Functions.

---

### **6. Configurer le domaine personnalisé (Optionnel)**

1. **Acheter un domaine** sur Route 53 ou ailleurs
2. **Créer un certificat SSL** dans AWS Certificate Manager (ACM)
3. **Configurer dans CloudFront** :
   - Alternate domain names (CNAMEs)
   - SSL certificate

---

## 🔧 Scripts automatisés

### **Script PowerShell de déploiement**

Créer `deploy-aws.ps1` :

```powershell
# Build
Write-Host "🔨 Building frontend..." -ForegroundColor Green
cd frontend
npm run build

# Déployer sur S3
Write-Host "📦 Deploying to S3..." -ForegroundColor Green
aws s3 sync dist/ s3://travelmate-frontend --delete

# Invalider CloudFront cache
Write-Host "🔄 Invalidating CloudFront cache..." -ForegroundColor Green
aws cloudfront create-invalidation --distribution-id VOTRE_DISTRIBUTION_ID --paths "/*"

Write-Host "✅ Deployment completed!" -ForegroundColor Green
```

---

## 📝 Checklist de déploiement

- [ ] AWS CLI installé et configuré
- [ ] Bucket S3 créé et configuré
- [ ] Build du frontend réussi (`npm run build`)
- [ ] Fichiers déployés sur S3
- [ ] CloudFront distribué créée
- [ ] Variables d'environnement configurées
- [ ] HTTPS activé
- [ ] Error pages configurées (SPA routing)
- [ ] Tests fonctionnels effectués

---

## 🆘 Problèmes courants

### **SPA routing (404 sur les routes React)**
- **Solution** : Configurer les Error Pages dans CloudFront (voir étape 4)

### **Variables d'environnement non disponibles**
- **Solution** : Utiliser CloudFront Functions ou script de build

### **Cache CloudFront trop long**
- **Solution** : Invalider le cache après chaque déploiement

---

## 💰 Coûts estimés

- **S3** : ~$0.023/GB stockage + $0.005/1000 requêtes
- **CloudFront** : ~$0.085/GB transfert (premiers 10TB)
- **Total** : Quasiment gratuit pour commencer (< $1/mois pour usage faible)

---

## 🚀 Prochaines étapes

Une fois le frontend déployé :
1. Configurer le backend sur AWS (ECS/App Runner avec le Dockerfile)
2. Mettre à jour `VITE_API_URL` avec l'URL du backend AWS
3. Configurer les domaines personnalisés
4. Mettre en place CI/CD (GitHub Actions → AWS)

