/**
 * Service de traduction automatique en utilisant l'API MyMemory
 * API gratuite sans clé requise : https://mymemory.translated.net/doc/spec.php
 * Limite : 10 000 caractères par jour (largement suffisant pour les recettes)
 */

import { convertUnits } from './translationHelpers';

// Cache des traductions pour éviter les appels répétés
const translationCache = new Map<string, string>();

/**
 * Traduit un texte de l'anglais vers le français automatiquement
 * @param text - Texte en anglais à traduire
 * @returns Texte traduit en français
 */
export async function translateText(text: string): Promise<string> {
  // Vérifier si c'est déjà en cache
  const cacheKey = text.toLowerCase().trim();
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // Si le texte est vide, retourner tel quel
  if (!text || text.trim().length === 0) {
    return text;
  }

  try {
    // Encoder le texte pour l'URL
    const encodedText = encodeURIComponent(text);
    
    // Appeler l'API MyMemory (gratuite, pas de clé nécessaire)
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|fr`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('⚠️ Erreur API de traduction, utilisation du texte original');
      return text;
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      
      // Mettre en cache
      translationCache.set(cacheKey, translated);
      
      console.log(`✅ Traduit: "${text}" → "${translated}"`);
      return translated;
    } else {
      console.warn('⚠️ Réponse API invalide, utilisation du texte original');
      return text;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la traduction:', error);
    return text;
  }
}

/**
 * Traduit un tableau de textes en parallèle
 * @param texts - Tableau de textes à traduire
 * @returns Tableau de textes traduits
 */
export async function translateTexts(texts: string[]): Promise<string[]> {
  // Pour éviter de surcharger l'API, on traduit par lots de 5
  const batchSize = 5;
  const results: string[] = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchPromises = batch.map(text => translateText(text));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Petite pause entre les lots pour respecter les limites de l'API
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
}

/**
 * Efface le cache de traduction
 */
export function clearTranslationCache(): void {
  translationCache.clear();
  console.log('🗑️ Cache de traduction effacé');
}

/**
 * Obtient la taille du cache
 */
export function getTranslationCacheSize(): number {
  return translationCache.size;
}
