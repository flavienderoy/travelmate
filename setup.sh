#!/bin/bash

echo "🚀 Configuration automatique TravelMate..."

# Copier les fichiers d'environnement
echo "📝 Configuration des variables d'environnement..."
cp backend/env.local backend/.env
cp frontend/env.local frontend/.env

echo "✅ Variables d'environnement configurées"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

echo "✅ Dépendances installées"

# Initialiser Firebase
echo "🔥 Configuration Firebase..."
cd frontend
firebase init --non-interactive --project travelmate-ynov
cd ..

echo "✅ Firebase configuré"

echo "🎉 Configuration terminée !"
echo ""
echo "Pour démarrer l'application :"
echo "npm run dev"
echo ""
echo "Ou séparément :"
echo "Terminal 1: cd backend && npm run dev"
echo "Terminal 2: cd frontend && npm run dev"
