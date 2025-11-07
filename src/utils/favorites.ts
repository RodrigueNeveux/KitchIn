// Gestion des recettes favorites dans localStorage

const FAVORITES_KEY = 'kitchin_favorite_recipes';

export function getFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lors de la lecture des favoris:', error);
    return [];
  }
}

export function isFavorite(recipeId: string): boolean {
  const favorites = getFavorites();
  return favorites.includes(recipeId);
}

export function toggleFavorite(recipeId: string): boolean {
  try {
    const favorites = getFavorites();
    const index = favorites.indexOf(recipeId);
    
    if (index > -1) {
      // Retirer des favoris
      favorites.splice(index, 1);
    } else {
      // Ajouter aux favoris
      favorites.push(recipeId);
    }
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return index === -1; // Retourne true si ajouté, false si retiré
  } catch (error) {
    console.error('Erreur lors de la modification des favoris:', error);
    return false;
  }
}

export function clearFavorites(): void {
  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression des favoris:', error);
  }
}
