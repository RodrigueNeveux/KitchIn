// Données de démonstration pour tester l'interface

export const demoProducts = [
  // Frigo
  {
    id: 'demo-1',
    name: 'Lait',
    quantity: 2,
    category: 'fridge' as const,
    expiryDate: getDaysFromNow(5),
    daysUntilExpiry: 5,
  },
  {
    id: 'demo-2',
    name: 'Yaourt',
    quantity: 6,
    category: 'fridge' as const,
    expiryDate: getDaysFromNow(7),
    daysUntilExpiry: 7,
  },
  {
    id: 'demo-3',
    name: 'Fromage',
    quantity: 1,
    category: 'fridge' as const,
    expiryDate: getDaysFromNow(12),
    daysUntilExpiry: 12,
  },
  {
    id: 'demo-4',
    name: 'Tomates',
    quantity: 4,
    category: 'fridge' as const,
    expiryDate: getDaysFromNow(3),
    daysUntilExpiry: 3,
  },
  {
    id: 'demo-5',
    name: 'Carottes',
    quantity: 8,
    category: 'fridge' as const,
    expiryDate: getDaysFromNow(10),
    daysUntilExpiry: 10,
  },
  {
    id: 'demo-6',
    name: 'Poulet',
    quantity: 1,
    category: 'fridge' as const,
    expiryDate: getDaysFromNow(2),
    daysUntilExpiry: 2,
  },
  {
    id: 'demo-7',
    name: 'Beurre',
    quantity: 1,
    category: 'fridge' as const,
    expiryDate: getDaysFromNow(30),
    daysUntilExpiry: 30,
  },
  {
    id: 'demo-8',
    name: 'Œufs',
    quantity: 12,
    category: 'fridge' as const,
    expiryDate: getDaysFromNow(14),
    daysUntilExpiry: 14,
  },

  // Garde-manger
  {
    id: 'demo-9',
    name: 'Pâtes',
    quantity: 3,
    category: 'pantry' as const,
  },
  {
    id: 'demo-10',
    name: 'Riz',
    quantity: 2,
    category: 'pantry' as const,
  },
  {
    id: 'demo-11',
    name: 'Huile d\'olive',
    quantity: 1,
    category: 'pantry' as const,
  },
  {
    id: 'demo-12',
    name: 'Sel',
    quantity: 1,
    category: 'pantry' as const,
  },
  {
    id: 'demo-13',
    name: 'Poivre',
    quantity: 1,
    category: 'pantry' as const,
  },
  {
    id: 'demo-14',
    name: 'Sucre',
    quantity: 1,
    category: 'pantry' as const,
  },
  {
    id: 'demo-15',
    name: 'Farine',
    quantity: 2,
    category: 'pantry' as const,
  },
  {
    id: 'demo-16',
    name: 'Sauce tomate',
    quantity: 3,
    category: 'pantry' as const,
    expiryDate: getDaysFromNow(180),
    daysUntilExpiry: 180,
  },
  {
    id: 'demo-17',
    name: 'Thon en boîte',
    quantity: 4,
    category: 'pantry' as const,
    expiryDate: getDaysFromNow(365),
    daysUntilExpiry: 365,
  },
  {
    id: 'demo-18',
    name: 'Lentilles',
    quantity: 2,
    category: 'pantry' as const,
  },

  // Congélateur
  {
    id: 'demo-19',
    name: 'Pain',
    quantity: 2,
    category: 'freezer' as const,
  },
  {
    id: 'demo-20',
    name: 'Légumes surgelés',
    quantity: 3,
    category: 'freezer' as const,
  },
  {
    id: 'demo-21',
    name: 'Poisson',
    quantity: 2,
    category: 'freezer' as const,
  },
  {
    id: 'demo-22',
    name: 'Glace',
    quantity: 1,
    category: 'freezer' as const,
  },
];

export const demoShoppingList = [
  // Liste principale
  {
    id: 'shop-demo-1',
    name: 'Lait',
    quantity: '2',
    checked: false,
    category: 'produits-laitiers',
    listId: 'main',
  },
  {
    id: 'shop-demo-2',
    name: 'Pain',
    quantity: '1',
    checked: false,
    category: 'epicerie',
    listId: 'main',
  },
  {
    id: 'shop-demo-3',
    name: 'Pommes',
    quantity: '6',
    checked: false,
    category: 'fruits-legumes',
    listId: 'main',
  },
  {
    id: 'shop-demo-4',
    name: 'Tomates',
    quantity: '4',
    checked: false,
    category: 'fruits-legumes',
    listId: 'main',
  },
  {
    id: 'shop-demo-5',
    name: 'Poulet',
    quantity: '1',
    checked: false,
    category: 'viande-poisson',
    listId: 'main',
  },
  {
    id: 'shop-demo-6',
    name: 'Yaourt',
    quantity: '4',
    checked: false,
    category: 'produits-laitiers',
    listId: 'main',
  },
  {
    id: 'shop-demo-7',
    name: 'Pâtes',
    quantity: '2',
    checked: false,
    category: 'epicerie',
    listId: 'main',
  },
  {
    id: 'shop-demo-8',
    name: 'Eau',
    quantity: '6',
    checked: true,
    category: 'boissons',
    listId: 'main',
  },
  {
    id: 'shop-demo-9',
    name: 'Fromage',
    quantity: '1',
    checked: true,
    category: 'produits-laitiers',
    listId: 'main',
  },
  
  // Liste semaine prochaine
  {
    id: 'shop-demo-10',
    name: 'Riz',
    quantity: '2',
    checked: false,
    category: 'epicerie',
    listId: 'next-week',
  },
  {
    id: 'shop-demo-11',
    name: 'Huile d\'olive',
    quantity: '1',
    checked: false,
    category: 'epicerie',
    listId: 'next-week',
  },
  {
    id: 'shop-demo-12',
    name: 'Saumon',
    quantity: '2',
    checked: false,
    category: 'viande-poisson',
    listId: 'next-week',
  },
  {
    id: 'shop-demo-13',
    name: 'Brocoli',
    quantity: '1',
    checked: false,
    category: 'fruits-legumes',
    listId: 'next-week',
  },
  
  // Liste pharmacie
  {
    id: 'shop-demo-14',
    name: 'Paracétamol',
    quantity: '1',
    checked: false,
    category: 'autres',
    listId: 'pharmacy',
  },
  {
    id: 'shop-demo-15',
    name: 'Vitamines C',
    quantity: '1',
    checked: false,
    category: 'autres',
    listId: 'pharmacy',
  },
  {
    id: 'shop-demo-16',
    name: 'Crème solaire',
    quantity: '1',
    checked: false,
    category: 'autres',
    listId: 'pharmacy',
  },
];

function getDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
