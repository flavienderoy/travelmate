# Guide d'Installation CI/CD & Monitoring

Pour activer l'intégration et le déploiement continus (CI/CD) ainsi que le monitoring sur votre projet TravelMate, suivez ces instructions.

## 1. Monitoring : Vérifier l'état de santé

Le monitoring est déjà configuré dans le code.

Pour le tester :
1.  Assurez-vous que le backend tourne : `npm run dev:backend`.
2.  Accédez à [http://localhost:3001/health](http://localhost:3001/health).
3.  Vous devez voir un JSON contenant l'uptime, l'utilisation CPU et Mémoire.

C'est cette URL que Google Cloud utilisera pour vérifier si votre application est en vie.

## 2. CI/CD : Configurer GitHub Actions

Le fichier de workflow est déjà créé dans `.github/workflows/ci-cd.yml`.
Cependant, pour qu'il ait le droit de déployer sur Google Cloud, vous devez ajouter une **clé secrète** dans les paramètres de votre dépôt GitHub.

### Étape A : Récupérer la Clé GCP
1.  Connectez-vous à la [Console Google Cloud - IAM](https://console.cloud.google.com/iam-admin/serviceaccounts?project=travelmate-ynov).
2.  Dans la liste, trouvez le compte de service utilisé par Cloud Run (souvent "Default Compute Service Account" ou un compte "travelmate").
3.  Cliquez sur les 3 petits points > **Gérer les clés**.
4.  Cliquez sur **Ajouter une clé** > **Créer une clé** > **JSON**.
5.  Un fichier `.json` va se télécharger. C'est votre pass VIP pour le Cloud.

### Étape B : Mettre la clé dans GitHub
1.  Allez sur votre dépôt GitHub.
2.  Cliquez sur l'onglet **Settings** (Paramètres).
3.  Dans le menu de gauche, allez dans **Secrets and variables** > **Actions**.
4.  Cliquez sur le bouton vert **New repository secret**.
5.  **Name** : `GCP_SA_KEY` (Copiez-collez exactement ce nom).
6.  **Secret** : Ouvrez le fichier JSON téléchargé avec un éditeur de texte (Notepad ou VS Code) et copiez TOUT le contenu. Collez-le ici.
7.  Cliquez sur **Add secret**.

### C'est terminé !
Maintenant, à chaque fois que vous pousserez du code sur la branche `main` (`git push`), GitHub va :
1.  Lancer automatiquement les tests du Backend et du Frontend.
2.  Si les tests réussissent, il déploiera automatiquement la nouvelle version sur Cloud Run.
