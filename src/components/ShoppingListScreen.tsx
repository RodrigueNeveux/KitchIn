import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from './ui/checkbox';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
}

interface ShoppingListScreenProps {
  items: ShoppingItem[];
  onBack: () => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (name: string, quantity: string) => void;
}

export function ShoppingListScreen({
  items,
  onBack,
  onToggleItem,
  onDeleteItem,
  onAddItem,
}: ShoppingListScreenProps) {
  const [activeList, setActiveList] = useState('main');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');

  const lists = [
    { id: 'main', label: 'Principale' },
    { id: 'next-week', label: 'Semaine Prochaine' },
    { id: 'pharmacy', label: 'Pharmacie' },
  ];

  const uncheckedItems = items.filter((item) => !item.checked);
  const checkedItems = items.filter((item) => item.checked);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAddItem(newItemName.trim(), newItemQuantity.trim() || 'x1');
      setNewItemName('');
      setNewItemQuantity('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 px-6 py-4 shadow-sm flex-shrink-0 transition-colors">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-gray-900 dark:text-white">
            Mes Listes de Courses
          </h1>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Plus className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </header>

      {/* List Tabs */}
      <div className="bg-white dark:bg-gray-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors">
        <div className="flex gap-2 max-w-md mx-auto overflow-x-auto">
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => setActiveList(list.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeList === list.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {list.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shopping Items List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-64">
        <div className="max-w-md mx-auto space-y-4">
          {/* Unchecked Items */}
          <div className="space-y-2">
            {uncheckedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3 transition-colors"
              >
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => onToggleItem(item.id)}
                  className="border-gray-300 dark:border-gray-600"
                />
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                </button>
              </div>
            ))}
          </div>

          {/* Checked Items */}
          {checkedItems.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {checkedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex items-center gap-3 opacity-60 transition-colors"
                >
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => onToggleItem(item.id)}
                    className="border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <p className="text-gray-600 dark:text-gray-400 line-through">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 line-through">
                      {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteItem(item.id)}
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

      {/* Add Item Section */}
      <div className="fixed bottom-20 left-0 right-0 bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40 transition-colors">
        <div className="max-w-md mx-auto">
          <p className="text-sm mb-3 text-gray-600 dark:text-gray-300">
            Ajouter un article
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nom du produit"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              style={{ 
                fontSize: '16px',
                minHeight: '44px'
              } as React.CSSProperties}
            />
            <input
              type="text"
              placeholder="Qté"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              className="w-24 px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-center text-gray-900 dark:text-white"
              style={{ 
                fontSize: '16px',
                minHeight: '44px'
              } as React.CSSProperties}
            />
            <button
              onClick={handleAddItem}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg transition-colors flex items-center justify-center"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
