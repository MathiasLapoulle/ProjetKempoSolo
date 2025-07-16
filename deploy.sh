#!/bin/bash

echo "🚀 Déploiement KempoSolo sur Render"
echo "======================================"

# Vérification des fichiers requis
echo "📋 Vérification des fichiers..."
if [ ! -f "render.yaml" ]; then
    echo "❌ Fichier render.yaml manquant"
    exit 1
fi

if [ ! -f "backend/package.json" ]; then
    echo "❌ Backend package.json manquant"
    exit 1
fi

if [ ! -f "front/package.json" ]; then
    echo "❌ Frontend package.json manquant"
    exit 1
fi

echo "✅ Fichiers de configuration trouvés"

# Test de build local
echo "🔨 Test de build backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur d'installation backend"
    exit 1
fi

echo "🔨 Test de build frontend..."
cd ../front
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur de build frontend"
    exit 1
fi

cd ..

echo "✅ Builds locaux réussis"

# Git commit et push
echo "📤 Commit et push vers GitHub..."
git add .
git commit -m "Deploy: Configuration pour Render"
git push origin main

echo "🎉 Déploiement prêt !"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Aller sur https://render.com"
echo "2. Connecter votre repository GitHub"
echo "3. Render détectera automatiquement le fichier render.yaml"
echo "4. Configurer les variables d'environnement si nécessaire"
echo "5. Déployer !"
echo ""
echo "🔗 URLs après déploiement:"
echo "Backend: https://kempo-backend.onrender.com"
echo "Frontend: https://kempo-frontend.onrender.com"
