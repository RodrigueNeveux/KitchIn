# 🍽️ Kitch'In - Application de Gestion de Cuisine

Application mobile iOS pour la gestion de cuisine domestique avec gestion d'inventaire, liste de courses, recettes et notifications de péremption.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 16 ou supérieure) - [Télécharger ici](https://nodejs.org/)
- **npm** ou **yarn** (gestionnaire de paquets, installé avec Node.js)
- **VS Code** (recommandé) - [Télécharger ici](https://code.visualstudio.com/)

## 🚀 Démarrage du projet

### 1. Ouvrir le projet dans VS Code

```bash
# Ouvrir VS Code dans le dossier du projet
code .
```

### 2. Installer les dépendances

Ouvrez un terminal dans VS Code (`Terminal > Nouveau Terminal` ou `` Ctrl+` ``) et exécutez :

```bash
npm install
```

*Ou si vous utilisez yarn :*
```bash
yarn install
```

### 3. Démarrer le serveur de développement

```bash
npm run dev
```

*Ou avec yarn :*
```bash
yarn dev
```

### 4. Accéder à l'application

Après le démarrage, l'application sera accessible à l'adresse :
```
http://localhost:5173
```

Ouvrez cette URL dans votre navigateur (Chrome, Firefox, Safari, etc.)

## 📱 Mode Développement Mobile

Pour tester l'application en mode mobile sur votre navigateur :

1. **Ouvrez les outils de développement** : `F12` ou `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
2. **Activez le mode responsive** : Cliquez sur l'icône de mobile/tablette ou appuyez sur `Ctrl+Shift+M`
3. **Sélectionnez un appareil** : iPhone 12/13/14 ou définissez une taille personnalisée (375x667px)

## 🔧 Commandes disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Prévisualiser la version de production
npm run preview

# Linter (vérifier le code)
npm run lint
```

## 🎯 Fonctionnalités principales

- ✅ **Gestion d'inventaire** avec catégories (Frigo, Placards, Congélateur)
- ✅ **Scanner de code-barres** avec API Open Food Facts
- ✅ **Notifications de péremption** avec alertes visuelles et sonores
- ✅ **Liste de courses** partagée entre membres du foyer
- ✅ **Recettes intelligentes** basées sur l'inventaire disponible
- ✅ **Mode sombre** automatique
- ✅ **Partage de foyer** via codes d'invitation
- ✅ **Mode démo** avec données pré-chargées

## 📂 Structure du projet

```
├── App.tsx                      # Composant principal
├── components/                  # Composants React
│   ├── HomeScreen.tsx          # Écran d'accueil
│   ├── InventoryScreen.tsx     # Gestion inventaire
│   ├── NotificationsScreen.tsx # Alertes péremption
│   ├── RecipesScreen.tsx       # Liste des recettes
│   ├── ShoppingListScreen.tsx  # Liste de courses
│   └── ...
├── utils/                       # Utilitaires
│   ├── demoData.ts             # Données de démonstration
│   ├── api.ts                  # Client API
│   └── supabase/               # Configuration Supabase
├── styles/                      # Styles CSS
│   └── globals.css             # Styles globaux
└── supabase/functions/         # Backend Supabase
    └── server/                 # API serveur
```

## 🌙 Mode Démo

L'application démarre actuellement en **mode démo** avec des données locales pré-chargées.

Pour tester les fonctionnalités :
1. **Connexion** : Utilisez n'importe quel email/mot de passe
2. **Inventaire** : Ajoutez des produits manuellement ou via le scanner
3. **Notifications** : Les produits expirant dans moins de 3 jours déclenchent des alertes
4. **Recettes** : Consultez les recettes basées sur votre inventaire
5. **Partage** : Générez un code d'invitation depuis le profil

## 🔐 Backend (Supabase)

Le backend est configuré mais fonctionne actuellement en mode démo.

Pour activer le backend complet :
1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Configurez les variables d'environnement dans `/utils/supabase/info.tsx`
4. Déployez les fonctions edge dans `/supabase/functions/server/`

## 🎨 Technologies utilisées

- **React** - Framework UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **Vite** - Build tool
- **Supabase** - Backend (Auth, Database, Storage)
- **Lucide React** - Icônes
- **Sonner** - Notifications toast
- **html5-qrcode** - Scanner de codes-barres
- **Recharts** - Graphiques (si nécessaire)

## 📱 Test sur appareil mobile réel

Pour tester sur votre téléphone :

1. Assurez-vous que votre ordinateur et téléphone sont sur le **même réseau WiFi**
2. Trouvez l'adresse IP locale de votre ordinateur :
   - **Windows** : `ipconfig` dans CMD
   - **Mac/Linux** : `ifconfig` ou `ip addr` dans Terminal
3. Démarrez le serveur : `npm run dev`
4. Sur votre téléphone, accédez à : `http://[VOTRE_IP]:5173`
   - Exemple : `http://192.168.1.10:5173`

## 🐛 Dépannage

### Le port 5173 est déjà utilisé
```bash
# Tuez le processus ou changez le port dans vite.config.ts
```

### Erreurs d'installation des dépendances
```bash
# Supprimez node_modules et package-lock.json, puis réinstallez
rm -rf node_modules package-lock.json
npm install
```

### L'application ne se charge pas
- Vérifiez que le serveur est bien démarré
- Videz le cache du navigateur (`Ctrl+Shift+R`)
- Vérifiez la console du navigateur pour les erreurs

## 📞 Support

Pour toute question ou problème :
- Consultez les fichiers dans `/guidelines/`
- Vérifiez la structure dans `/Attributions.md`
- Ouvrez les outils de développement du navigateur (F12) pour voir les erreurs

## 🎉 Bon développement !

L'application est maintenant prête à être utilisée. Amusez-vous bien avec Kitch'In ! 🚀
