import { ArrowLeft, Plus, Trash2, ShoppingCart, Check, X, Sparkles, MoveRight } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { useThemeStyles } from '../contexts/ThemeContext';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  category?: string;
  listId?: string;
}

interface ShoppingLists {
  main: ShoppingItem[];
  'next-week': ShoppingItem[];
  pharmacy: ShoppingItem[];
}

interface ShoppingListScreenProps {
  lists: ShoppingLists;
  onBack: () => void;
  onToggleItem: (listId: string, id: string) => void;
  onDeleteItem: (listId: string, id: string) => void;
  onAddItem: (listId: string, name: string, quantity: string) => void;
  onMoveItem: (itemId: string, fromListId: string, toListId: string) => void;
}

// Catégories de produits
const CATEGORIES = {
  'fruits-legumes': { label: '🥕 Fruits & Légumes', emoji: '🥕' },
  'viande-poisson': { label: '🥩 Viande & Poisson', emoji: '🥩' },
  'produits-laitiers': { label: '🥛 Produits Laitiers', emoji: '🥛' },
  'epicerie': { label: '🍝 Épicerie', emoji: '🍝' },
  'boissons': { label: '🥤 Boissons', emoji: '🥤' },
  'surgeles': { label: '🧊 Surgelés', emoji: '🧊' },
  'autres': { label: '🛒 Autres', emoji: '🛒' },
};

// Suggestions de produits courants
const QUICK_ADD_SUGGESTIONS = [
  { name: 'Lait', category: 'produits-laitiers' },
  { name: 'Pain', category: 'epicerie' },
  { name: 'Œufs', category: 'produits-laitiers' },
  { name: 'Tomates', category: 'fruits-legumes' },
  { name: 'Poulet', category: 'viande-poisson' },
  { name: 'Pâtes', category: 'epicerie' },
  { name: 'Yaourt', category: 'produits-laitiers' },
  { name: 'Fromage', category: 'produits-laitiers' },
];

// Fonction pour détecter la catégorie
function detectCategory(productName: string): string {
  const name = productName.toLowerCase();
  
  if (/(tomate|carotte|pomme|banane|orange|salade|légume|fruit|oignon|ail|pomme de terre|courgette|aubergine)/i.test(name)) {
    return 'fruits-legumes';
  }
  if (/(poulet|viande|porc|bœuf|poisson|saumon|thon|jambon|steak)/i.test(name)) {
    return 'viande-poisson';
  }
  if (/(lait|yaourt|fromage|beurre|crème|œuf)/i.test(name)) {
    return 'produits-laitiers';
  }
  if (/(eau|jus|soda|café|thé|coca)/i.test(name)) {
    return 'boissons';
  }
  if (/(surgelé|glace|légumes surgelés)/i.test(name)) {
    return 'surgeles';
  }
  if (/(pâtes|riz|farine|sucre|sel|huile|sauce|conserve|pain)/i.test(name)) {
    return 'epicerie';
  }
  
  return 'autres';
}

export function ShoppingListScreen({
  lists,
  onBack,
  onToggleItem,
  onDeleteItem,
  onAddItem,
  onMoveItem,
}: ShoppingListScreenProps) {
  const [activeList, setActiveList] = useState<keyof ShoppingLists>('main');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const listConfigs = [
    { id: 'main' as keyof ShoppingLists, label: '🛒 Principale', color: 'green' },
    { id: 'next-week' as keyof ShoppingLists, label: '📅 Semaine Prochaine', color: 'blue' },
    { id: 'pharmacy' as keyof ShoppingLists, label: '⚕️ Pharmacie', color: 'red' },
  ];

  const currentItems = lists[activeList];
  const uncheckedItems = currentItems.filter((item) => !item.checked);
  const checkedItems = currentItems.filter((item) => item.checked);
  
  // Progrès
  const totalItems = currentItems.length;
  const checkedCount = checkedItems.length;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  // Grouper par catégorie
  const itemsByCategory = uncheckedItems.reduce((acc, item) => {
    const category = item.category || detectCategory(item.name);
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const handleAddItem = (name?: string, qty?: string) => {
    const itemName = name || newItemName.trim();
    const quantity = qty || newItemQuantity.trim();
    
    if (itemName) {
      onAddItem(activeList, itemName, quantity || '1');
      setNewItemName('');
      setNewItemQuantity('1');
      setShowSuggestions(false);
      setShowAddDialog(false);
    }
  };

  const handleQuickAdd = (productName: string) => {
    handleAddItem(productName, '1');
  };

  const openAddDialog = () => {
    setShowAddDialog(true);
    setShowSuggestions(true);
  };

  const handleClearChecked = () => {
    checkedItems.forEach(item => onDeleteItem(activeList, item.id));
  };

  const handleMoveToList = (itemId: string, toListId: keyof ShoppingLists) => {
    if (toListId !== activeList) {
      onMoveItem(itemId, activeList, toListId);
    }
  };

  // Calculer le nombre total d'articles pour chaque liste
  const getListStats = (listId: keyof ShoppingLists) => {
    const items = lists[listId];
    const unchecked = items.filter(i => !i.checked).length;
    return { total: items.length, unchecked };
  };

  const styles = useThemeStyles();

  return (
    <div className="flex flex-col h-screen bg-gray-900" style={styles.background}>
      {/* Header */}
      <header 
        className="bg-white dark:bg-gray-800 px-6 py-4 shadow-sm flex-shrink-0 transition-colors"
        style={styles.header}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="md:invisible p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="text-center">
            <h1 className="text-gray-900 dark:text-white">
              Mes Listes de Courses
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {uncheckedItems.length} articles à acheter
            </p>
          </div>
          <div className="w-10 md:invisible"></div>
        </div>
      </header>

      {/* Progress Bar */}
      {totalItems > 0 && (
        <div className="bg-white dark:bg-gray-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Progression
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {progress}% ({checkedCount}/{totalItems})
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* List Tabs */}
      <div className="bg-white dark:bg-gray-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors">
        <div className="flex gap-2 max-w-6xl mx-auto overflow-x-auto">
          {listConfigs.map((list) => {
            const stats = getListStats(list.id);
            return (
              <button
                key={list.id}
                onClick={() => setActiveList(list.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all relative ${
                  activeList === list.id
                    ? `bg-${list.color}-600 text-white shadow-md scale-105`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                style={
                  activeList === list.id
                    ? {
                        backgroundColor: list.color === 'green' ? '#16a34a' : list.color === 'blue' ? '#2563eb' : '#dc2626'
                      }
                    : undefined
                }
              >
                {list.label}
                {stats.unchecked > 0 && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                    activeList === list.id 
                      ? 'bg-white/20' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    {stats.unchecked}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>



      {/* Shopping Items List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-32 md:pb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unchecked Items - Grouped by Category */}
          {Object.entries(itemsByCategory).map(([categoryKey, categoryItems]) => (
            <div key={categoryKey} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2 flex items-center gap-2">
                <span>{CATEGORIES[categoryKey as keyof typeof CATEGORIES]?.label || '🛒 Autres'}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({categoryItems.length})
                </span>
              </h3>
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3 transition-all hover:shadow-md group"
                >
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => onToggleItem(activeList, item.id)}
                    className="border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quantité : {item.quantity}
                    </p>
                  </div>
                  
                  {/* Move to other list button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoveRight className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {listConfigs
                        .filter(list => list.id !== activeList)
                        .map(list => (
                          <DropdownMenuItem
                            key={list.id}
                            onClick={() => handleMoveToList(item.id, list.id)}
                          >
                            Déplacer vers {list.label}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button
                    onClick={() => onDeleteItem(activeList, item.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          ))}

          {uncheckedItems.length === 0 && checkedItems.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Cette liste est vide
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Ajoutez des articles ci-dessous
              </p>
            </div>
          )}

          {/* Checked Items */}
          {checkedItems.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-2 mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Articles achetés ({checkedItems.length})
                </h3>
                <button
                  onClick={handleClearChecked}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Tout effacer
                </button>
              </div>
              {checkedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex items-center gap-3 opacity-60 transition-all hover:opacity-80"
                >
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => onToggleItem(activeList, item.id)}
                    className="border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <p className="text-gray-600 dark:text-gray-400 line-through">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 line-through">
                      Quantité : {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteItem(activeList, item.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={openAddDialog}
        className="fixed bottom-24 md:bottom-8 right-6 md:right-8 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Ajouter un article
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Ajoutez un nouvel article à votre liste "{listConfigs.find(l => l.id === activeList)?.label}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Quick Add Suggestions */}
            {showSuggestions && (
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  Suggestions rapides
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_ADD_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAdd(suggestion.name)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                    >
                      + {suggestion.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Nom du produit
                </label>
                <input
                  type="text"
                  placeholder="Ex: Lait, Pain, Tomates..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Quantité
                </label>
                <input
                  type="text"
                  placeholder="1"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-center text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowAddDialog(false);
                  setNewItemName('');
                  setNewItemQuantity('1');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleAddItem()}
                disabled={!newItemName.trim()}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ajouter
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}