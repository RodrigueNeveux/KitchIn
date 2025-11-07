import { Clock, Users, ChefHat, CheckCircle2, Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useMemo } from 'react';
import { frenchRecipes } from '../utils/recipesData';
import { additionalRecipes } from '../utils/additionalRecipes';
import { moreRecipes } from '../utils/moreRecipes';
import { extraRecipes } from '../utils/extraRecipes';
import { megaRecipes } from '../utils/megaRecipes';
import { ultimateRecipes } from '../utils/ultimateRecipes';
import { superRecipes } from '../utils/superRecipes';
import { epicRecipes } from '../utils/epicRecipes';
import { useThemeStyles } from '../contexts/ThemeContext';
import { getFavorites, toggleFavorite } from '../utils/favorites';
import { Star } from 'lucide-react';

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
  // Propriétés pour le matching avec l'inventaire
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

export function RecipesScreen({ onRecipeClick, availableProducts = [] }: RecipesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'can-make' | 'missing-few'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(getFavorites());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const styles = useThemeStyles();

  const handleToggleFavorite = (recipeId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Empêcher le clic sur la carte
    toggleFavorite(recipeId);
    setFavorites(getFavorites());
  };

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    const cats = new Set([...frenchRecipes, ...additionalRecipes, ...moreRecipes, ...extraRecipes, ...megaRecipes, ...ultimateRecipes, ...superRecipes, ...epicRecipes].map(r => r.category));
    return ['all', ...Array.from(cats)];
  }, []);

  // Normalize text for matching
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/s$/, '')
      .trim();
  };

  // Calculer les ingrédients disponibles et manquants pour chaque recette
  const recipesWithAvailability = useMemo(() => {
    return [...frenchRecipes, ...additionalRecipes, ...moreRecipes, ...extraRecipes, ...megaRecipes, ...ultimateRecipes, ...superRecipes, ...epicRecipes].map(recipe => {
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
  }, [availableProducts]);

  // Filtrer les recettes selon la recherche et les filtres
  const filteredRecipes = useMemo(() => {
    let filtered = recipesWithAvailability;

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

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

    // Filtrer par favoris
    if (showFavoritesOnly) {
      filtered = filtered.filter(recipe => favorites.includes(recipe.id));
    }

    return filtered;
  }, [recipesWithAvailability, searchQuery, filter, selectedCategory, favorites, showFavoritesOnly]);

  // Statistiques
  const stats = useMemo(() => {
    const canMake = recipesWithAvailability.filter(r => (r.missedIngredientCount || 0) === 0).length;
    const missingFew = recipesWithAvailability.filter(r => 
      (r.missedIngredientCount || 0) > 0 && (r.missedIngredientCount || 0) <= 3
    ).length;
    
    return { canMake, missingFew, total: recipesWithAvailability.length };
  }, [recipesWithAvailability]);

  return (
    <div className="flex flex-col h-screen bg-gray-900" style={styles.background}>
      {/* Header */}
      <header 
        className="bg-white dark:bg-gray-800 px-6 py-4 shadow-sm"
        style={styles.header}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center text-gray-900 dark:text-white mb-4">
            🍳 Recettes
          </h1>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une recette..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat === 'all' ? 'Toutes' : cat}
              </button>
            ))}
          </div>

          {/* Filters by Availability */}
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

          {/* Favorites Filter */}
          <div className="mt-3">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                showFavoritesOnly
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {showFavoritesOnly ? 'Masquer les favoris' : 'Afficher les favoris'}
            </button>
          </div>
        </div>
      </header>

      {/* Recipes Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {filteredRecipes.length === 0 ? (
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
                  handleToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(recipe.id)}
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
  handleToggleFavorite: (recipeId: string, event: React.MouseEvent) => void;
  isFavorite: boolean;
}

function RecipeCard({ recipe, onClick, showIngredientMatch, handleToggleFavorite, isFavorite }: RecipeCardProps) {
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
            {recipe.missedIngredientCount} ingrédient{recipe.missedIngredientCount > 1 ? 's' : ''} manquant{recipe.missedIngredientCount > 1 ? 's' : ''}\n          </div>
        )}

        {/* Badge de catégorie */}
        <div className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
          {recipe.category}
        </div>

        {/* Favorite Star */}
        <button
          onClick={(e) => handleToggleFavorite(recipe.id, e)}
          className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Star
            className={`w-5 h-5 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`}
          />
        </button>
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