# 🍳 Kitch'In - Configuration des APIs

## APIs Utilisées

### 1. 🍽️ TheMealDB (Recettes)

**API Principale pour les Recettes**

- **Site** : https://www.themealdb.com/
- **Documentation** : https://www.themealdb.com/api.php
- **Coût** : 100% Gratuit et Illimité ✅
- **Avantages** :
  - Aucune clé API requise
  - Aucune limite de requêtes
  - Plus de 600 recettes
  - Images haute qualité
  - Support de 20+ cuisines
  - Vidéos YouTube incluses
  - Parfait pour publication App Store/Play Store

**Utilisation dans l'app** :
```typescript
import { searchByArea, convertMealToRecipe } from './utils/mealDbApi';

// Charger des recettes italiennes
const meals = await searchByArea('Italian');
const recipes = meals.map(convertMealToRecipe);
```

**Endpoints** :
- `/filter.php?a={area}` - Recettes par cuisine
- `/filter.php?c={category}` - Recettes par catégorie
- `/search.php?s={name}` - Recherche par nom
- `/lookup.php?i={id}` - Détails d'une recette
- `/random.php` - Recette aléatoire

---

### 2. 📦 Open Food Facts (Scan de Code-Barres)

**Base de Données Alimentaire Ouverte**

- **Site** : https://world.openfoodfacts.org/
- **Documentation** : https://openfoodfacts.github.io/api-documentation/
- **Coût** : 100% Gratuit et Open Source ✅
- **Avantages** :
  - Base de données collaborative
  - Plus de 2 millions de produits
  - Scan de code-barres
  - Informations nutritionnelles
  - Photos des produits
  - Disponible mondialement

**Utilisation dans l'app** :
```typescript
import { scanBarcode } from './utils/api';

// Scanner un code-barres
const product = await scanBarcode('3017620422003');
// Retourne les détails du produit
```

**Endpoint** :
- `https://world.openfoodfacts.org/api/v0/product/{barcode}.json`

---

### 3. 🌐 MyMemory Translation (Traduction)

**API de Traduction Gratuite**

- **Site** : https://mymemory.translated.net/
- **Documentation** : https://mymemory.translated.net/doc/spec.php
- **Coût** : Gratuit jusqu'à 1000 mots/jour ✅
- **Avantages** :
  - Traduction de qualité
  - Support de nombreuses langues
  - Aucune clé API requise
  - Suffisant pour usage quotidien

**Utilisation dans l'app** :
```typescript
import { translateText } from './utils/translationApi';

// Traduire en français
const translated = await translateText('Chicken Teriyaki', 'fr');
// Retourne: "Poulet Teriyaki"
```

**Endpoint** :
- `https://api.mymemory.translated.net/get?q={text}&langpair=en|{targetLang}`

**Note** : Pour une utilisation intensive (> 1000 mots/jour), considérez :
- S'inscrire pour augmenter la limite
- Utiliser LibreTranslate (auto-hébergé)
- Cacher les traductions dans le localStorage

---

## Configuration

### Aucune Clé API Requise ! 🎉

Toutes les APIs utilisées sont **gratuites et ne nécessitent pas de clé API** pour un usage de base.

### Variables d'Environnement (Optionnel)

Si vous souhaitez utiliser des clés API pour augmenter les limites :

```bash
# .env
VITE_MYMEMORY_API_KEY=votre_cle_ici  # Optionnel
```

---

## Limites et Quotas

| API | Limite Gratuite | Suffisant pour ? |
|-----|----------------|------------------|
| TheMealDB | ∞ Illimité | ✅ Oui, parfait |
| Open Food Facts | ∞ Illimité | ✅ Oui, parfait |
| MyMemory | 1000 mots/jour | ✅ Oui (avec cache) |

---

## Recommandations pour Production

### 1. Cache Intelligent 💾

```typescript
// Cache des traductions
const translationCache = new Map<string, string>();

async function cachedTranslate(text: string): Promise<string> {
  if (translationCache.has(text)) {
    return translationCache.get(text)!;
  }
  
  const result = await translateText(text);
  translationCache.set(text, result);
  
  // Sauvegarder dans localStorage
  localStorage.setItem('translations', 
    JSON.stringify(Array.from(translationCache.entries()))
  );
  
  return result;
}
```

### 2. Préchargement des Données 📥

Précharger les recettes populaires au build :

```typescript
// scripts/preloadRecipes.ts
import { searchByArea, convertMealToRecipe } from './utils/mealDbApi';

const cuisines = ['Italian', 'French', 'Mexican', 'Chinese', 'Japanese'];

for (const cuisine of cuisines) {
  const meals = await searchByArea(cuisine);
  const recipes = meals.map(convertMealToRecipe);
  
  // Sauvegarder en JSON
  fs.writeFileSync(
    `./data/${cuisine.toLowerCase()}.json`,
    JSON.stringify(recipes)
  );
}
```

### 3. Mode Hors Ligne 📴

```typescript
// Service Worker pour cacher les recettes
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('themealdb.com')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open('recipes-v1').then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
```

---

## Alternatives (si besoin)

### Pour les Recettes

| API | Coût | Limite | Qualité |
|-----|------|--------|---------|
| TheMealDB | Gratuit | ∞ | ⭐⭐⭐⭐⭐ |
| Edamam | Gratuit | 5000/mois | ⭐⭐⭐⭐ |
| Spoonacular | Payant | 150/jour | ⭐⭐⭐⭐⭐ |
| Recipe Puppy | Gratuit | ∞ | ⭐⭐⭐ |

### Pour la Traduction

| API | Coût | Limite | Qualité |
|-----|------|--------|---------|
| MyMemory | Gratuit | 1000 mots/jour | ⭐⭐⭐⭐ |
| LibreTranslate | Gratuit | ∞ (auto-hébergé) | ⭐⭐⭐⭐ |
| Google Translate | Payant | 500k caractères/mois gratuit | ⭐⭐⭐⭐⭐ |
| DeepL | Payant | 500k caractères/mois gratuit | ⭐⭐⭐⭐⭐ |

---

## Support et Contribution

### TheMealDB

- **Support** : https://www.themealdb.com/contact.php
- **Patreon** : https://www.patreon.com/thedatadb
- **Contribution** : Vous pouvez contribuer des recettes !

### Open Food Facts

- **GitHub** : https://github.com/openfoodfacts
- **Contribution** : Scanner et ajouter des produits
- **Discord** : https://slack.openfoodfacts.org/

---

## Conclusion

✅ **Configuration actuelle = 0€/mois**

🎉 **Toutes les APIs sont gratuites et sans limite problématique**

🚀 **Prêt pour publication sur les stores** sans soucis de coûts !

💡 **Conseil** : Avec un bon système de cache, l'application peut fonctionner presque entièrement hors ligne après le premier chargement.
