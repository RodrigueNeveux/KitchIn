/**
 * Spoonacular API Service
 * Documentation: https://spoonacular.com/food-api/docs
 *
 * FREE: 150 requests per day
 * To get an API key:
 * 1. Go to https://spoonacular.com/food-api/console
 * 2. Create a free account
 * 3. Copy your API Key
 * 4. Replace YOUR_SPOONACULAR_API_KEY below
 */

const SPOONACULAR_API_KEY = "394eb39e9bc04ef5931b23dcf41aeaff";
const BASE_URL = "https://api.spoonacular.com";
const DEMO_MODE = SPOONACULAR_API_KEY === "YOUR_SPOONACULAR_API_KEY";

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  missedIngredients?: Array<{
    id: number;
    amount: number;
    unit: string;
    name: string;
    original: string;
    image: string;
  }>;
  usedIngredients?: Array<{
    id: number;
    amount: number;
    unit: string;
    name: string;
    original: string;
    image: string;
  }>;
  unusedIngredients?: Array<{
    id: number;
    amount: number;
    unit: string;
    name: string;
    original: string;
    image: string;
  }>;
  likes?: number;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
}

export interface RecipeDetails extends SpoonacularRecipe {
  instructions?: string;
  extendedIngredients?: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }>;
  analyzedInstructions?: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
      ingredients: Array<{
        id: number;
        name: string;
        image: string;
      }>;
      equipment: Array<{
        id: number;
        name: string;
        image: string;
      }>;
    }>;
  }>;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  summary?: string;
  cuisines?: string[];
  dishTypes?: string[];
  diets?: string[];
}

export async function findRecipesByIngredients(
  ingredients: string[],
  number: number = 20,
  ranking: 1 | 2 = 1,
): Promise<SpoonacularRecipe[]> {
  if (DEMO_MODE) {
    console.warn("DEMO MODE: Spoonacular API not configured.");
    return getDemoRecipes();
  }

  try {
    const ingredientsString = ingredients.join(",+");
    const url = `${BASE_URL}/recipes/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${ingredientsString}&number=${number}&ranking=${ranking}&ignorePantry=true`;

    console.log('🔍 Recherche de recettes avec:', ingredients);
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ Erreur API Spoonacular (${response.status}):`, errorData);
      throw new Error(
        `Spoonacular API Error: ${response.status} - ${errorData}`,
      );
    }

    const data = await response.json();
    console.log('✅ Recettes trouvées:', data.length);
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la recherche de recettes:", error);
    return getDemoRecipes();
  }
}

export async function getRecipeDetails(
  recipeId: number,
): Promise<RecipeDetails | null> {
  if (DEMO_MODE) {
    console.warn("DEMO MODE: Spoonacular API not configured.");
    return getDemoRecipeDetails(recipeId);
  }

  try {
    const url = `${BASE_URL}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`;

    console.log('🔍 Chargement des détails de la recette:', recipeId);
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ Erreur API Spoonacular (${response.status}):`, errorData);
      throw new Error(
        `Spoonacular API Error: ${response.status} - ${errorData}`,
      );
    }

    const data = await response.json();
    console.log('✅ Détails de la recette chargés:', data.title);
    return data;
  } catch (error) {
    console.error("❌ Erreur lors du chargement des détails:", error);
    return null;
  }
}

export async function searchRecipes(
  query: string,
  number: number = 20,
): Promise<{
  results: SpoonacularRecipe[];
  totalResults: number;
}> {
  if (DEMO_MODE) {
    console.warn("DEMO MODE: Spoonacular API not configured.");
    return { results: getDemoRecipes(), totalResults: 10 };
  }

  try {
    const url = `${BASE_URL}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(query)}&number=${number}&addRecipeInformation=true`;

    console.log('🔍 Recherche de recettes par texte:', query);
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ Erreur API Spoonacular (${response.status}):`, errorData);
      throw new Error(
        `Spoonacular API Error: ${response.status} - ${errorData}`,
      );
    }

    const data = await response.json();
    console.log('✅ Recettes trouvées:', data.results?.length || 0);
    return {
      results: data.results || [],
      totalResults: data.totalResults || 0,
    };
  } catch (error) {
    console.error("❌ Erreur lors de la recherche de recettes:", error);
    return { results: getDemoRecipes(), totalResults: 0 };
  }
}

function getDemoRecipes(): SpoonacularRecipe[] {
  return [
    {
      id: 1,
      title: "Roast Chicken with Vegetables",
      image:
        "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
      usedIngredientCount: 5,
      missedIngredientCount: 1,
      readyInMinutes: 45,
      servings: 4,
      likes: 250,
    },
    {
      id: 2,
      title: "Classic Caesar Salad",
      image:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
      usedIngredientCount: 4,
      missedIngredientCount: 2,
      readyInMinutes: 15,
      servings: 2,
      likes: 180,
    },
    {
      id: 3,
      title: "Pasta Carbonara",
      image:
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop",
      usedIngredientCount: 6,
      missedIngredientCount: 0,
      readyInMinutes: 20,
      servings: 3,
      likes: 320,
    },
    {
      id: 4,
      title: "Homemade Tomato Soup",
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
      usedIngredientCount: 3,
      missedIngredientCount: 1,
      readyInMinutes: 30,
      servings: 4,
      likes: 145,
    },
    {
      id: 5,
      title: "Apple Pie",
      image:
        "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400&h=300&fit=crop",
      usedIngredientCount: 4,
      missedIngredientCount: 2,
      readyInMinutes: 60,
      servings: 6,
      likes: 275,
    },
    {
      id: 6,
      title: "Grilled Salmon with Lemon",
      image:
        "https://images.unsplash.com/photo-1580959375944-c1be86f036a0?w=400&h=300&fit=crop",
      usedIngredientCount: 3,
      missedIngredientCount: 2,
      readyInMinutes: 25,
      servings: 2,
      likes: 195,
    },
    {
      id: 7,
      title: "Fried Rice with Vegetables",
      image:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
      usedIngredientCount: 5,
      missedIngredientCount: 1,
      readyInMinutes: 20,
      servings: 3,
      likes: 210,
    },
    {
      id: 8,
      title: "Homemade Burger",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      usedIngredientCount: 4,
      missedIngredientCount: 3,
      readyInMinutes: 35,
      servings: 4,
      likes: 340,
    },
  ];
}

function getDemoRecipeDetails(
  recipeId: number,
): RecipeDetails | null {
  const demoRecipes = getDemoRecipes();
  const recipe = demoRecipes.find((r) => r.id === recipeId);

  if (!recipe) return null;

  // Détails de recettes de démo en français
  const recipeDetailsMap: Record<number, RecipeDetails> = {
    1: {
      ...recipe,
      instructions: "1. Préchauffer le four à 200°C. 2. Assaisonner le poulet. 3. Couper les légumes. 4. Disposer dans un plat. 5. Cuire 45 minutes. 6. Servir chaud.",
      summary: "Un délicieux poulet rôti avec des légumes de saison.",
      extendedIngredients: [
        { id: 1, name: "poulet", amount: 1.5, unit: "kg", original: "1.5kg poulet" },
        { id: 2, name: "carottes", amount: 4, unit: "pièces", original: "4 carottes" },
        { id: 3, name: "pommes de terre", amount: 6, unit: "pièces", original: "6 pommes de terre" },
        { id: 4, name: "oignon", amount: 2, unit: "pièces", original: "2 oignons" },
        { id: 5, name: "huile d'olive", amount: 3, unit: "c. à soupe", original: "3 c. à soupe d'huile d'olive" },
      ],
      analyzedInstructions: [
        {
          name: "",
          steps: [
            { number: 1, step: "Préchauffer le four à 200°C.", ingredients: [], equipment: [{ id: 1, name: "four", image: "oven.jpg" }] },
            { number: 2, step: "Assaisonner le poulet avec du sel et du poivre.", ingredients: [], equipment: [] },
            { number: 3, step: "Couper les légumes en gros morceaux.", ingredients: [], equipment: [] },
            { number: 4, step: "Disposer le poulet et les légumes dans un plat.", ingredients: [], equipment: [] },
            { number: 5, step: "Arroser d'huile d'olive et enfourner 45 minutes.", ingredients: [], equipment: [] },
          ],
        },
      ],
      cuisines: ["Française"],
      dishTypes: ["Plat principal"],
      diets: [],
    },
    2: {
      ...recipe,
      instructions: "1. Laver la salade. 2. Préparer la sauce César. 3. Griller le pain. 4. Couper le poulet. 5. Mélanger le tout. 6. Servir frais.",
      summary: "Une salade César classique et délicieuse.",
      extendedIngredients: [
        { id: 1, name: "laitue romaine", amount: 1, unit: "pièce", original: "1 laitue romaine" },
        { id: 2, name: "poulet grillé", amount: 200, unit: "g", original: "200g poulet grillé" },
        { id: 3, name: "parmesan", amount: 50, unit: "g", original: "50g parmesan" },
        { id: 4, name: "croûtons", amount: 100, unit: "g", original: "100g croûtons" },
      ],
      analyzedInstructions: [
        {
          name: "",
          steps: [
            { number: 1, step: "Laver et essorer la laitue.", ingredients: [], equipment: [] },
            { number: 2, step: "Préparer la sauce César avec mayonnaise, ail et anchois.", ingredients: [], equipment: [] },
            { number: 3, step: "Couper le poulet en lamelles.", ingredients: [], equipment: [] },
            { number: 4, step: "Mélanger tous les ingrédients.", ingredients: [], equipment: [] },
          ],
        },
      ],
      cuisines: ["Américaine"],
      dishTypes: ["Salade"],
      diets: [],
    },
    3: {
      ...recipe,
      instructions: "1. Cuire les pâtes. 2. Faire revenir les lardons. 3. Battre les œufs. 4. Mélanger hors du feu. 5. Servir immédiatement.",
      summary: "Des pâtes carbonara crémeuses et authentiques.",
      extendedIngredients: [
        { id: 1, name: "spaghetti", amount: 400, unit: "g", original: "400g spaghetti" },
        { id: 2, name: "lardons", amount: 200, unit: "g", original: "200g lardons" },
        { id: 3, name: "œufs", amount: 4, unit: "pièces", original: "4 œufs" },
        { id: 4, name: "parmesan", amount: 100, unit: "g", original: "100g parmesan" },
      ],
      analyzedInstructions: [
        {
          name: "",
          steps: [
            { number: 1, step: "Faire cuire les pâtes dans de l'eau salée bouillante.", ingredients: [], equipment: [] },
            { number: 2, step: "Faire revenir les lardons dans une poêle.", ingredients: [], equipment: [] },
            { number: 3, step: "Battre les œufs avec le parmesan râpé.", ingredients: [], equipment: [] },
            { number: 4, step: "Mélanger les pâtes chaudes avec les lardons et les œufs hors du feu.", ingredients: [], equipment: [] },
          ],
        },
      ],
      cuisines: ["Italienne"],
      dishTypes: ["Plat principal"],
      diets: [],
    },
  };

  // Retourner les détails spécifiques ou des détails génériques en français
  return recipeDetailsMap[recipeId] || {
    ...recipe,
    instructions: "1. Préparer les ingrédients. 2. Suivre les étapes de cuisson. 3. Servir et déguster!",
    summary: "Une délicieuse recette facile à réaliser.",
    extendedIngredients: [
      { id: 1, name: "Ingrédient 1", amount: 200, unit: "g", original: "200g ingrédient 1" },
      { id: 2, name: "Ingrédient 2", amount: 100, unit: "ml", original: "100ml ingrédient 2" },
      { id: 3, name: "Ingrédient 3", amount: 2, unit: "pièces", original: "2 ingrédient 3" },
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Préparer tous les ingrédients.", ingredients: [], equipment: [] },
          { number: 2, step: "Mélanger et cuire selon les instructions.", ingredients: [], equipment: [] },
          { number: 3, step: "Servir et déguster!", ingredients: [], equipment: [] },
        ],
      },
    ],
    cuisines: ["Française"],
    dishTypes: ["Plat principal"],
    diets: [],
  };
}

export function isApiConfigured(): boolean {
  return !DEMO_MODE;
}

export function getRemainingQuota(): number {
  if (DEMO_MODE) return 150;
  return 150;
}