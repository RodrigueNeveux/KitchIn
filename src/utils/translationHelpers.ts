// Fonctions utilitaires pour la traduction et conversion d'unités

// Fonction pour convertir les unités impériales en métriques
export function convertUnits(text: string): string {
  let result = text;
  
  // Convertir oz (onces) en g (grammes) - 1 oz ≈ 28.35g
  result = result.replace(/(\d+(?:\.\d+)?)\s*(?:oz|ounces?)\b/gi, (_match, amount) => {
    const grams = Math.round(parseFloat(amount) * 28.35);
    return `${grams}g`;
  });
  
  // Convertir lb (livres) en g ou kg - 1 lb ≈ 453.6g
  result = result.replace(/(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?)\b/gi, (_match, amount) => {
    const grams = Math.round(parseFloat(amount) * 453.6);
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)}kg`;
    }
    return `${grams}g`;
  });
  
  // Convertir cups en ml - 1 cup ≈ 240ml
  result = result.replace(/(\d+(?:\.\d+)?)\s*cups?\b/gi, (_match, amount) => {
    const ml = Math.round(parseFloat(amount) * 240);
    return `${ml}ml`;
  });
  
  // Convertir tablespoons en c. à soupe
  result = result.replace(/(\d+(?:\.\d+)?)\s*(?:tablespoons?|tbsp)\b/gi, (_match, amount) => {
    return `${amount} c. à soupe`;
  });
  
  // Convertir teaspoons en c. à café
  result = result.replace(/(\d+(?:\.\d+)?)\s*(?:teaspoons?|tsp)\b/gi, (_match, amount) => {
    return `${amount} c. à café`;
  });
  
  // Convertir températures Fahrenheit en Celsius
  result = result.replace(/(\d+)\s*°?\s*F\b/gi, (_match, temp) => {
    const celsius = Math.round((parseFloat(temp) - 32) * 5 / 9);
    return `${celsius}°C`;
  });
  
  return result;
}

// Fonction pour échapper les caractères spéciaux dans une regex
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Fonction complète pour remplacer avec limites de mots
export function replaceWithWordBoundaries(text: string, searchTerm: string, replacement: string): string {
  const escaped = escapeRegex(searchTerm);
  const regex = new RegExp('\\b' + escaped + '\\b', 'gi');
  return text.replace(regex, replacement);
}
