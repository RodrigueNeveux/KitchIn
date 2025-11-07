/**
 * Outils de débogage pour la traduction
 */

import { CULINARY_DICTIONARY } from './culinaryDictionary';

/**
 * Analyse un texte et retourne les mots non traduits
 * @param originalText - Texte original en anglais
 * @param translatedText - Texte traduit
 * @returns Liste des mots qui n'ont pas été traduits
 */
export function findUntranslatedWords(originalText: string, translatedText: string): string[] {
  const untranslated: string[] = [];
  
  // Extraire les mots de l'original (lettres uniquement)
  const originalWords = originalText.toLowerCase().match(/\b[a-z]+\b/g) || [];
  const translatedWords = translatedText.toLowerCase().match(/\b[a-z]+\b/g) || [];
  
  for (const word of originalWords) {
    // Si le mot est toujours présent dans le texte traduit et n'est pas dans le dictionnaire
    if (translatedWords.includes(word) && !CULINARY_DICTIONARY[word]) {
      if (!untranslated.includes(word)) {
        untranslated.push(word);
      }
    }
  }
  
  return untranslated;
}

/**
 * Affiche un rapport de traduction dans la console
 * @param originalText - Texte original
 * @param translatedText - Texte traduit
 * @param callback - Fonction de callback pour collecter les mots non traduits
 */
export function logTranslationReport(
  originalText: string, 
  translatedText: string,
  callback?: (words: string[]) => void
): void {
  const untranslated = findUntranslatedWords(originalText, translatedText);
  
  if (untranslated.length > 0) {
    console.warn(`⚠️ Mots non traduits (${untranslated.length}):`, untranslated.join(', '));
    console.log(`Original: "${originalText}"`);
    console.log(`Traduit:  "${translatedText}"`);
    
    // Appeler le callback si fourni
    if (callback) {
      callback(untranslated);
    }
  }
}

/**
 * Suggère des ajouts au dictionnaire basés sur des mots non traduits
 * @param untranslatedWords - Liste de mots non traduits
 * @returns Code à ajouter au dictionnaire
 */
export function suggestDictionaryAdditions(untranslatedWords: string[]): string {
  if (untranslatedWords.length === 0) {
    return 'Aucun ajout suggéré - tous les mots sont traduits !';
  }
  
  let suggestions = '// Ajouts suggérés pour le dictionnaire:\n';
  for (const word of untranslatedWords) {
    suggestions += `  '${word}': 'TRADUCTION_A_AJOUTER',\n`;
  }
  
  return suggestions;
}

/**
 * Active le mode de débogage pour la traduction
 */
export function enableTranslationDebug(): void {
  console.log('🔍 Mode DEBUG de traduction activé');
  console.log(`📖 Dictionnaire contient ${Object.keys(CULINARY_DICTIONARY).length} mots`);
}
