/**
 * Service de traduction automatique en utilisant l'API MyMemory
 * API gratuite sans clé requise : https://mymemory.translated.net/doc/spec.php
 * Limite : 10 000 caractères par jour (largement suffisant pour les recettes)
 */

import { convertUnits } from './translationHelpers';
import { translateWithDictionary, translateWordsInText, aggressiveTranslate } from './culinaryDictionary';

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

  // 1. Essayer d'abord avec le dictionnaire culinaire (exact match)
  const dictionaryTranslation = translateWithDictionary(text);
  if (dictionaryTranslation) {
    translationCache.set(cacheKey, dictionaryTranslation);
    console.log(`📖 Dictionnaire exact: "${text}" → "${dictionaryTranslation}"`);
    return dictionaryTranslation;
  }

  // 2. Traduction agressive avec le dictionnaire (mot par mot)
  const aggressiveTranslation = aggressiveTranslate(text);
  
  // Si la traduction agressive a changé au moins 30% du texte, l'utiliser directement
  const changedRatio = aggressiveTranslation.length > 0 ? 
    (text.length - aggressiveTranslation.length) / text.length : 0;
  
  if (Math.abs(changedRatio) > 0.3 || aggressiveTranslation !== text) {
    console.log(`🔨 Traduction agressive: "${text}" → "${aggressiveTranslation}"`);
    translationCache.set(cacheKey, aggressiveTranslation);
    return aggressiveTranslation;
  }
  
  // 3. En dernier recours, essayer l'API MyMemory (mais peu fiable)
  try {
    const encodedText = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|fr`;
    
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(3000) // Timeout de 3 secondes
    });
    
    if (!response.ok) {
      console.warn('⚠️ Erreur API, utilisation de la traduction agressive');
      translationCache.set(cacheKey, aggressiveTranslation);
      return aggressiveTranslation;
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const apiTranslation = data.responseData.translatedText;
      
      // Post-traiter la traduction de l'API avec le dictionnaire
      const finalTranslation = translateWordsInText(apiTranslation);
      
      translationCache.set(cacheKey, finalTranslation);
      console.log(`✅ API + Post-traitement: "${text}" → "${finalTranslation}"`);
      return finalTranslation;
    } else {
      console.warn('⚠️ Réponse API invalide, utilisation de la traduction agressive');
      translationCache.set(cacheKey, aggressiveTranslation);
      return aggressiveTranslation;
    }
  } catch (error) {
    console.warn('⚠️ Erreur/Timeout API, utilisation de la traduction agressive:', error);
    translationCache.set(cacheKey, aggressiveTranslation);
    return aggressiveTranslation;
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
