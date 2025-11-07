// API TheMealDB - 100% Gratuite et illimitée !
// Documentation: https://www.themealdb.com/api.php

export interface MealDbRecipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  // Ingrédients (jusqu'à 20)
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  // Mesures
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
}

interface MealDbResponse {
  meals: MealDbRecipe[] | null;
}

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Cache pour éviter les requêtes répétées
const cache = new Map<string, MealDbRecipe[]>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure

/**
 * Rechercher des recettes par catégorie
 */
export async function searchByCategory(category: string): Promise<MealDbRecipe[]> {
  const cacheKey = `category_${category}`;
  
  // Vérifier le cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: MealDbResponse = await response.json();
    
    if (!data.meals) {
      return [];
    }

    // Charger les détails complets pour chaque recette
    const detailedMeals = await Promise.all(
      data.meals.slice(0, 15).map(meal => getMealById(meal.idMeal))
    );

    const results = detailedMeals.filter((m): m is MealDbRecipe => m !== null);
    cache.set(cacheKey, results);
    
    return results;
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    return [];
  }
}

/**
 * Rechercher des recettes par zone géographique (cuisine)
 */
export async function searchByArea(area: string): Promise<MealDbRecipe[]> {
  const cacheKey = `area_${area}`;
  
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await fetch(`${BASE_URL}/filter.php?a=${area}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: MealDbResponse = await response.json();
    
    if (!data.meals) {
      return [];
    }

    // Charger les détails complets pour chaque recette
    const detailedMeals = await Promise.all(
      data.meals.slice(0, 20).map(meal => getMealById(meal.idMeal))
    );

    const results = detailedMeals.filter((m): m is MealDbRecipe => m !== null);
    cache.set(cacheKey, results);
    
    return results;
  } catch (error) {
    console.error('Error fetching recipes by area:', error);
    return [];
  }
}

/**
 * Rechercher des recettes par nom
 */
export async function searchByName(name: string): Promise<MealDbRecipe[]> {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: MealDbResponse = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

/**
 * Obtenir une recette par ID
 */
export async function getMealById(id: string): Promise<MealDbRecipe | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: MealDbResponse = await response.json();
    return data.meals?.[0] || null;
  } catch (error) {
    console.error('Error fetching meal details:', error);
    return null;
  }
}

/**
 * Obtenir une recette aléatoire
 */
export async function getRandomMeal(): Promise<MealDbRecipe | null> {
  try {
    const response = await fetch(`${BASE_URL}/random.php`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: MealDbResponse = await response.json();
    return data.meals?.[0] || null;
  } catch (error) {
    console.error('Error fetching random meal:', error);
    return null;
  }
}

/**
 * Obtenir plusieurs recettes aléatoires
 */
export async function getRandomMeals(count: number): Promise<MealDbRecipe[]> {
  const promises = Array.from({ length: count }, () => getRandomMeal());
  const results = await Promise.all(promises);
  return results.filter((m): m is MealDbRecipe => m !== null);
}

/**
 * Extraire les ingrédients d'une recette TheMealDB
 */
export function extractIngredients(meal: MealDbRecipe): { item: string; quantity: string }[] {
  const ingredients: { item: string; quantity: string }[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof MealDbRecipe];
    const measure = meal[`strMeasure${i}` as keyof MealDbRecipe];

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        item: ingredient.trim(),
        quantity: measure?.trim() || '',
      });
    }
  }

  return ingredients;
}

/**
 * Convertir une recette TheMealDB en format de l'application
 */
export function convertMealToRecipe(meal: MealDbRecipe): {
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
  area: string;
  tags: string[];
  youtubeUrl?: string;
} {
  const ingredients = extractIngredients(meal);
  const steps = meal.strInstructions
    ? meal.strInstructions
        .split('\n')
        .filter(step => step.trim().length > 0)
        .map(step => step.trim())
    : [];

  // Déterminer la difficulté basée sur le nombre d'ingrédients
  let difficulty: 'Facile' | 'Moyen' | 'Difficile' = 'Moyen';
  if (ingredients.length <= 5) difficulty = 'Facile';
  else if (ingredients.length >= 12) difficulty = 'Difficile';

  // Estimer les temps de préparation et cuisson
  const totalSteps = steps.length;
  const prepTime = Math.max(10, Math.min(30, totalSteps * 3));
  const cookTime = Math.max(15, Math.min(90, ingredients.length * 5));

  return {
    id: `mealdb-${meal.idMeal}`,
    name: meal.strMeal,
    image: meal.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    prepTime,
    cookTime,
    servings: 4,
    difficulty,
    ingredients,
    steps,
    category: meal.strCategory || 'Autre',
    area: meal.strArea || '',
    tags: meal.strTags ? meal.strTags.split(',').map(t => t.trim()) : [],
    youtubeUrl: meal.strYoutube || undefined,
  };
}

// Mapping des types de cuisine pour l'interface
export const CUISINE_AREAS = {
  italian: 'Italian',
  french: 'French',
  mexican: 'Mexican',
  chinese: 'Chinese',
  japanese: 'Japanese',
  thai: 'Thai',
  indian: 'Indian',
  american: 'American',
  british: 'British',
  canadian: 'Canadian',
  spanish: 'Spanish',
  greek: 'Greek',
  moroccan: 'Moroccan',
  polish: 'Polish',
  russian: 'Russian',
  turkish: 'Turkish',
  vietnamese: 'Vietnamese',
  irish: 'Irish',
  jamaican: 'Jamaican',
  croatian: 'Croatian',
};

// Catégories disponibles
export const MEAL_CATEGORIES = [
  'Beef',
  'Chicken',
  'Dessert',
  'Lamb',
  'Miscellaneous',
  'Pasta',
  'Pork',
  'Seafood',
  'Side',
  'Starter',
  'Vegan',
  'Vegetarian',
  'Breakfast',
  'Goat',
];
