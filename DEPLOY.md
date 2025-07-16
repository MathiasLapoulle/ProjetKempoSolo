# 🚀 Guide de Déploiement sur Render

## Fichiers créés pour le déploiement

### 1. Configuration Render
- **`render.yaml`** : Configuration principale pour Render
- **`.env.example`** : Variables d'environnement nécessaires
- **`deploy.sh`** : Script de déploiement automatique

### 2. Configuration Backend
- **`backend/src/config/environment.ts`** : Configuration environnement
- **`backend/src/mikro-orm.config.ts`** : Configuration DB pour production
- **`backend/src/main.ts`** : Serveur avec CORS et health check

### 3. Configuration Frontend
- **`front/src/config/api.js`** : Configuration API dynamique

## 🔧 Étapes de déploiement

### 1. Préparation locale
```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Lancer le script de déploiement
./deploy.sh
```

### 2. Configuration Render
1. Aller sur [render.com](https://render.com)
2. Connecter votre repository GitHub
3. Render détectera automatiquement `render.yaml`
4. Configurer les variables d'environnement :

#### Backend Variables
```
NODE_ENV=production
JWT_SECRET=your-secret-key
DATABASE_URL=mysql://user:pass@host:port/db
CORS_ORIGIN=https://kempo-frontend.onrender.com
```

#### Frontend Variables
```
REACT_APP_API_URL=https://kempo-backend.onrender.com
```

### 3. Base de données
Render créera automatiquement une base MySQL selon la configuration dans `render.yaml`.

### 4. Déploiement
- **Backend** : `https://kempo-backend.onrender.com`
- **Frontend** : `https://kempo-frontend.onrender.com`
- **Health Check** : `https://kempo-backend.onrender.com/health`

## 🔍 Vérification post-déploiement

### Tests à effectuer :
1. **Backend Health** : `GET /health`
2. **API Documentation** : `GET /docs`
3. **Frontend Load** : Interface utilisateur
4. **Authentication** : Login/Register
5. **Database** : CRUD operations

### Logs de débogage :
```bash
# Via Render Dashboard
Services > kempo-backend > Logs
Services > kempo-frontend > Logs
```

## 🚨 Dépannage

### Problèmes courants :
1. **Build failed** : Vérifier les dépendances dans package.json
2. **Database connection** : Vérifier DATABASE_URL
3. **CORS errors** : Vérifier CORS_ORIGIN
4. **API calls fail** : Vérifier REACT_APP_API_URL

### Solutions :
- Redéployer : Dashboard > Manual Deploy
- Vérifier les variables d'environnement
- Consulter les logs détaillés

## 📊 Monitoring

### Métriques à surveiller :
- **Temps de réponse** : API endpoints
- **Uptime** : Services availability
- **Erreurs** : 4xx/5xx responses
- **Database** : Connection pool

### Alertes recommandées :
- Service down > 5 minutes
- Response time > 2 seconds
- Error rate > 5%

## 🔒 Sécurité

### Variables sensibles :
- `JWT_SECRET` : Généré automatiquement par Render
- `DATABASE_URL` : Fourni par Render Database
- `MAILJET_API_KEY` : À configurer manuellement

### Recommandations :
- Rotation régulière des secrets
- Monitoring des tentatives d'accès
- Backup de la base de données

## 📈 Scaling

### Auto-scaling :
Render peut automatiquement scaler selon :
- CPU usage
- Memory usage
- Request volume

### Configuration :
```yaml
scaling:
  minInstances: 1
  maxInstances: 3
  targetCPUPercent: 70
```

## 💰 Coûts

### Estimation mensuelle :
- **Backend** : $7-25/mois (selon usage)
- **Frontend** : Gratuit (sites statiques)
- **Database** : $7-15/mois
- **Total** : ~$15-40/mois

### Optimisation :
- Utiliser le plan gratuit pour les tests
- Monitoring pour éviter les pics
- Optimisation des requêtes DB
