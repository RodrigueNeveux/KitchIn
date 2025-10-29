import { Clock, Users, ChefHat, CheckCircle2, Search, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect, useMemo } from 'react';
import { findRecipesByIngredients, isApiConfigured } from '../utils/spoonacularApi';
import { frenchRecipes, translateRecipeTitle, translateCategory, translateIngredient } from '../utils/recipesData';
import { translateText } from '../utils/translationApi';
import { toast } from 'sonner@2.0.3';

export interface Recipe {
  id: string;
  name: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  ingredients: { item: string; quantity: string }[];
  steps: string[];
  category: string;
  // Propriétés pour l'API Spoonacular
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  missedIngredients?: string[];
  usedIngredients?: string[];
}

interface Product {
  id: string;
  name: string;
  quantity: number;
  category: string;
}

interface RecipesScreenProps {
  onRecipeClick: (recipe: Recipe) => void;
  availableProducts?: Product[];
}

// Importer les recettes françaises depuis le fichier dédié
const DEMO_RECIPES: Recipe[] = frenchRecipes.slice(0, 8); // On garde 8 recettes pour la compatibilité

// Toutes les recettes françaises disponibles
const ALL_FRENCH_RECIPES: Recipe[] = frenchRecipes;

// Anciennes recettes de démo (conservées pour référence)
const OLD_DEMO_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Pâtes Carbonara',
    image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYXxlbnwxfHx8fDE3NjA4OTc2NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Facile',
    category: 'Plat principal',
    usedIngredientCount: 4,
    missedIngredientCount: 2,
    ingredients: [
      { item: 'Spaghetti', quantity: '400g' },
      { item: 'Lardons', quantity: '200g' },
      { item: 'Œufs', quantity: '4' },
      { item: 'Parmesan', quantity: '100g' },
      { item: 'Poivre', quantity: 'Au goût' },
    ],
    steps: [
      'Faire cuire les pâtes dans de l\'eau salée bouillante.',
      'Faire revenir les lardons dans une poêle.',
      'Battre les œufs avec le parmesan.',
      'Mélanger les pâtes chaudes avec les lardons et les œufs.',
      'Servir immédiatement avec du poivre fraîchement moulu.',
    ],
  },
  {
    id: '2',
    name: 'Poulet au Curry',
    image: 'https://images.unsplash.com/photo-1707448829764-9474458021ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwY3VycnklMjByaWNlfGVufDF8fHx8MTc2MDkyNTUzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    difficulty: 'Moyen',
    category: 'Plat principal',
    usedIngredientCount: 5,
    missedIngredientCount: 3,
    ingredients: [
      { item: 'Filets de poulet', quantity: '600g' },
      { item: 'Oignon', quantity: '2' },
      { item: 'Curry en poudre', quantity: '2 c. à soupe' },
      { item: 'Lait de coco', quantity: '400ml' },
      { item: 'Riz basmati', quantity: '300g' },
      { item: 'Tomates', quantity: '2' },
    ],
    steps: [
      'Couper le poulet en morceaux.',
      'Faire revenir les oignons et le poulet.',
      'Ajouter le curry et le lait de coco.',
      'Ajouter les tomates coupées en dés.',
      'Laisser mijoter 25 minutes.',
      'Servir avec du riz basmati.',
    ],
  },
  {
    id: '3',
    name: 'Salade César',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZHxlbnwxfHx8fDE3NjA5MjU1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 15,
    cookTime: 0,
    servings: 2,
    difficulty: 'Facile',
    category: 'Entrée',
    usedIngredientCount: 3,
    missedIngredientCount: 2,
    ingredients: [
      { item: 'Laitue romaine', quantity: '1' },
      { item: 'Poulet grillé', quantity: '200g' },
      { item: 'Parmesan', quantity: '50g' },
      { item: 'Croûtons', quantity: '100g' },
      { item: 'Sauce César', quantity: '100ml' },
    ],
    steps: [
      'Laver et couper la salade.',
      'Couper le poulet en lanières.',
      'Mélanger tous les ingrédients.',
      'Ajouter la sauce César.',
      'Servir immédiatement.',
    ],
  },
  {
    id: '4',
    name: 'Saumon grillé au citron',
    image: 'https://images.unsplash.com/photo-1580959375944-c1be86f036a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MDkyNTUzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'Facile',
    category: 'Plat principal',
    usedIngredientCount: 2,
    missedIngredientCount: 2,
    ingredients: [
      { item: 'Filets de saumon', quantity: '2' },
      { item: 'Citron', quantity: '1' },
      { item: 'Huile d\'olive', quantity: '2 c. à soupe' },
      { item: 'Sel et poivre', quantity: 'Au goût' },
    ],
    steps: [
      'Préchauffer le grill du four.',
      'Badigeonner le saumon d\'huile d\'olive.',
      'Assaisonner de sel et poivre.',
      'Griller 12-15 minutes.',
      'Servir avec des quartiers de citron.',
    ],
  },
  {
    id: '5',
    name: 'Omelette aux champignons',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbWVsZXR0ZXxlbnwxfHx8fDE3NjA5MjU1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'Facile',
    category: 'Plat principal',
    usedIngredientCount: 3,
    missedIngredientCount: 1,
    ingredients: [
      { item: 'Œufs', quantity: '6' },
      { item: 'Champignons', quantity: '200g' },
      { item: 'Fromage', quantity: '50g' },
      { item: 'Beurre', quantity: '20g' },
      { item: 'Sel et poivre', quantity: 'Au goût' },
    ],
    steps: [
      'Faire revenir les champignons dans du beurre.',
      'Battre les œufs avec sel et poivre.',
      'Verser les œufs dans la poêle.',
      'Ajouter le fromage râpé.',
      'Plier l\'omelette et servir chaud.',
    ],
  },
  {
    id: '6',
    name: 'Soupe de tomates maison',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBzb3VwfGVufDF8fHx8MTc2MDkyNTUzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 'Facile',
    category: 'Soupe',
    usedIngredientCount: 4,
    missedIngredientCount: 1,
    ingredients: [
      { item: 'Tomates', quantity: '1kg' },
      { item: 'Oignon', quantity: '1' },
      { item: 'Ail', quantity: '2 gousses' },
      { item: 'Huile d\'olive', quantity: '2 c. à soupe' },
      { item: 'Bouillon de légumes', quantity: '500ml' },
    ],
    steps: [
      'Faire revenir l\'oignon et l\'ail dans l\'huile.',
      'Ajouter les tomates coupées en morceaux.',
      'Verser le bouillon de légumes.',
      'Laisser mijoter 20 minutes.',
      'Mixer et servir chaud.',
    ],
  },
  {
    id: '7',
    name: 'Risotto aux champignons',
    image: 'https://images.unsplash.com/photo-1476124369491-b79715f3ed87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXNvdHRvfGVufDF8fHx8MTc2MDkyNTUzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    difficulty: 'Moyen',
    category: 'Plat principal',
    usedIngredientCount: 3,
    missedIngredientCount: 2,
    ingredients: [
      { item: 'Riz arborio', quantity: '300g' },
      { item: 'Champignons', quantity: '300g' },
      { item: 'Oignon', quantity: '1' },
      { item: 'Vin blanc', quantity: '100ml' },
      { item: 'Bouillon', quantity: '1L' },
      { item: 'Parmesan', quantity: '80g' },
      { item: 'Beurre', quantity: '30g' },
    ],
    steps: [
      'Faire revenir l\'oignon haché dans le beurre.',
      'Ajouter les champignons coupés.',
      'Incorporer le riz et mélanger.',
      'Ajouter le vin blanc et laisser évaporer.',
      'Ajouter le bouillon louche par louche en remuant.',
      'Incorporer le parmesan et servir.',
    ],
  },
  {
    id: '8',
    name: 'Tarte aux pommes',
    image: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMHBpZXxlbnwxfHx8fDE3NjA5MjU1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    difficulty: 'Moyen',
    category: 'Dessert',
    usedIngredientCount: 2,
    missedIngredientCount: 3,
    ingredients: [
      { item: 'Pâte brisée', quantity: '1' },
      { item: 'Pommes', quantity: '5' },
      { item: 'Sucre', quantity: '80g' },
      { item: 'Beurre', quantity: '30g' },
      { item: 'Cannelle', quantity: '1 c. à café' },
    ],
    steps: [
      'Préchauffer le four à 180°C.',
      'Étaler la pâte dans un moule.',
      'Éplucher et couper les pommes en tranches.',
      'Disposer les pommes sur la pâte.',
      'Saupoudrer de sucre et de cannelle.',
      'Enfourner 40 minutes.',
    ],
  },
];

export function RecipesScreen({ onRecipeClick, availableProducts = [] }: RecipesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>(ALL_FRENCH_RECIPES);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'can-make' | 'missing-few'>('all');
  const [useInventory, setUseInventory] = useState(false);

  // Vérifier si l'API est configurée
  const apiConfigured = isApiConfigured();

  // Convertir les produits en liste d'ingrédients pour l'API
  const inventoryIngredients = useMemo(() => {
    return availableProducts.map(p => p.name.toLowerCase());
  }, [availableProducts]);

  // Charger les recettes basées sur l'inventaire
  const loadRecipesFromInventory = async () => {
    setLoading(true);
    try {
      const spoonacularRecipes = await findRecipesByIngredients(inventoryIngredients, 20, 1);
      
      console.log('🌍 Traduction automatique des titres de recettes...');
      
      // Traduire tous les titres automatiquement
      const titles = spoonacularRecipes.map(r => r.title);
      const translatedTitles = await Promise.all(titles.map(title => translateText(title)));
      
      // Convertir les recettes Spoonacular en format Recipe avec traduction automatique
      const convertedRecipes: Recipe[] = spoonacularRecipes.map((r, idx) => ({
        id: r.id.toString(),
        name: translatedTitles[idx], // Traduction automatique du titre
        image: r.image,
        prepTime: 0,
        cookTime: r.readyInMinutes || 30,
        servings: r.servings || 4,
        difficulty: 'Moyen' as const,
        category: 'Plat principal',
        ingredients: [],
        steps: [],
        usedIngredientCount: r.usedIngredientCount || 0,
        missedIngredientCount: r.missedIngredientCount || 0,
        missedIngredients: r.missedIngredients?.map(i => i.name) || [], // Garde l'anglais ici, sera traduit dans DetailScreen
        usedIngredients: r.usedIngredients?.map(i => i.name) || [], // Garde l'anglais ici, sera traduit dans DetailScreen
      }));

      setRecipes(convertedRecipes);
      console.log(`✅ ${convertedRecipes.length} recettes traduites et chargées`);
      toast.success(`${convertedRecipes.length} recettes trouvées !`);
    } catch (error) {
      console.error('Erreur lors du chargement des recettes:', error);
      toast.error('Erreur lors du chargement des recettes');
      setRecipes(ALL_FRENCH_RECIPES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (useInventory && inventoryIngredients.length > 0 && apiConfigured) {
      loadRecipesFromInventory();
    } else if (!useInventory) {
      setRecipes(ALL_FRENCH_RECIPES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useInventory, apiConfigured]);

  // Normalize text for matching
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/s$/, '')
      .trim();
  };

  // Calculer les ingrédients disponibles et manquants pour chaque recette locale
  const recipesWithAvailability = useMemo(() => {
    if (useInventory) {
      return recipes; // Les recettes API ont déjà ces infos
    }

    return recipes.map(recipe => {
      const usedIngredients: string[] = [];
      const missedIngredients: string[] = [];

      recipe.ingredients.forEach(ingredient => {
        const normalizedIngredient = normalizeText(ingredient.item);
        const isAvailable = availableProducts.some(product => {
          const normalizedProduct = normalizeText(product.name);
          return (
            normalizedIngredient.includes(normalizedProduct) ||
            normalizedProduct.includes(normalizedIngredient) ||
            (normalizedIngredient.includes('pate') && normalizedProduct.includes('spaghetti')) ||
            (normalizedIngredient.includes('spaghetti') && normalizedProduct.includes('pate'))
          );
        });

        if (isAvailable) {
          usedIngredients.push(ingredient.item);
        } else {
          missedIngredients.push(ingredient.item);
        }
      });

      return {
        ...recipe,
        usedIngredients,
        missedIngredients,
        usedIngredientCount: usedIngredients.length,
        missedIngredientCount: missedIngredients.length,
      };
    });
  }, [recipes, availableProducts, useInventory]);

  // Filtrer les recettes selon la recherche et les filtres
  const filteredRecipes = useMemo(() => {
    let filtered = recipesWithAvailability;

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.category && recipe.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filtrer selon le type
    if (filter === 'can-make') {
      filtered = filtered.filter(recipe => (recipe.missedIngredientCount || 0) === 0);
    } else if (filter === 'missing-few') {
      filtered = filtered.filter(recipe => 
        (recipe.missedIngredientCount || 0) > 0 && (recipe.missedIngredientCount || 0) <= 3
      );
    }

    return filtered;
  }, [recipesWithAvailability, searchQuery, filter]);

  // Statistiques
  const stats = useMemo(() => {
    const canMake = recipesWithAvailability.filter(r => (r.missedIngredientCount || 0) === 0).length;
    const missingFew = recipesWithAvailability.filter(r => 
      (r.missedIngredientCount || 0) > 0 && (r.missedIngredientCount || 0) <= 3
    ).length;
    
    return { canMake, missingFew, total: recipesWithAvailability.length };
  }, [recipesWithAvailability]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center text-gray-900 dark:text-white mb-4">
            🍳 Recettes
          </h1>

          {/* Alerte API non configurée */}
          {!apiConfigured && availableProducts.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-blue-900 dark:text-blue-100 font-medium mb-1">
                  Mode recettes françaises 🇫🇷
                </p>
                <p className="text-blue-700 dark:text-blue-300 text-xs">
                  {ALL_FRENCH_RECIPES.length} recettes traditionnelles françaises disponibles. Pour débloquer la recherche intelligente avec l'API Spoonacular (recettes traduites), configurez votre clé dans <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded">utils/spoonacularApi.ts</code>
                </p>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une recette..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Toggle Inventory Search */}
          {apiConfigured && availableProducts.length > 0 && (
            <button
              onClick={() => setUseInventory(!useInventory)}
              disabled={loading}
              className={`w-full mb-4 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                useInventory
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Recherche en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {useInventory
                      ? `✓ Recettes avec mon inventaire (${inventoryIngredients.length} ingrédients)`
                      : `Rechercher avec mon inventaire`}
                  </span>
                </>
              )}
            </button>
          )}

          {/* Filters */}
          {availableProducts.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  filter === 'all'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Toutes ({stats.total})
              </button>
              <button
                onClick={() => setFilter('can-make')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  filter === 'can-make'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ✅ Je peux faire ({stats.canMake})
              </button>
              <button
                onClick={() => setFilter('missing-few')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  filter === 'missing-few'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ⚠️ Quelques ingrédients manquants ({stats.missingFew})
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Recipes Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-20">
              <ChefHat className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? 'Aucune recette trouvée pour cette recherche'
                  : 'Aucune recette disponible'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => onRecipeClick(recipe)}
                  showIngredientMatch={availableProducts.length > 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  showIngredientMatch?: boolean;
}

function RecipeCard({ recipe, onClick, showIngredientMatch }: RecipeCardProps) {
  const canMake = (recipe.missedIngredientCount || 0) === 0;
  const missingFew = (recipe.missedIngredientCount || 0) > 0 && (recipe.missedIngredientCount || 0) <= 3;

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge de correspondance */}
        {showIngredientMatch && canMake && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
            <CheckCircle2 className="w-4 h-4" />
            Vous avez tout !
          </div>
        )}
        
        {showIngredientMatch && missingFew && recipe.missedIngredientCount && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
            {recipe.missedIngredientCount} ingrédient{recipe.missedIngredientCount > 1 ? 's' : ''} manquant{recipe.missedIngredientCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-gray-900 dark:text-white mb-3 line-clamp-2">
          {recipe.name}
        </h3>

        {/* Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} pers.</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>

        {/* Ingredient match details */}
        {showIngredientMatch && (recipe.usedIngredientCount || 0) > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-600 dark:text-green-400">
                ✓ {recipe.usedIngredientCount} ingrédient{(recipe.usedIngredientCount || 0) > 1 ? 's' : ''} disponible{(recipe.usedIngredientCount || 0) > 1 ? 's' : ''}
              </span>
              {(recipe.missedIngredientCount || 0) > 0 && (
                <span className="text-orange-600 dark:text-orange-400">
                  ✗ {recipe.missedIngredientCount} manquant{(recipe.missedIngredientCount || 0) > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
