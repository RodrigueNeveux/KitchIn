import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { InventoryScreen } from './components/InventoryScreen';
import { ShoppingListScreen } from './components/ShoppingListScreen';
import { AuthScreen } from './components/AuthScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AddProductScreen } from './components/AddProductScreen';
import { RecipesScreen } from './components/RecipesScreen';
import { RecipeDetailScreen } from './components/RecipeDetailScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { ThemeProvider } from './contexts/ThemeContext';
import type { Recipe } from './components/RecipesScreen';
import { ResponsiveNav } from './components/ResponsiveNav';
import { Toaster } from './components/ui/sonner';
import { supabase } from './utils/supabase/client';
import { apiClient } from './utils/api';
import { toast } from 'sonner@2.0.3';
import { demoProducts, demoShoppingList } from './utils/demoData';
import { initializeNotifications } from './utils/notifications';

interface Product {
  id: string;
  name: string;
  quantity: number;
  expiryDate?: string;
  image?: string;
  category: 'fridge' | 'pantry' | 'freezer';
  daysUntilExpiry?: number;
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  category?: string;
  listId?: string; // Pour identifier à quelle liste appartient l'article
}

interface ShoppingLists {
  main: ShoppingItem[];
  'next-week': ShoppingItem[];
  pharmacy: ShoppingItem[];
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [household, setHousehold] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [shoppingLists, setShoppingLists] = useState<ShoppingLists>({
    main: demoShoppingList.filter(item => !item.listId || item.listId === 'main').map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      checked: item.checked,
      category: item.category,
      listId: 'main',
    })),
    'next-week': demoShoppingList.filter(item => item.listId === 'next-week').map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      checked: item.checked,
      category: item.category,
      listId: 'next-week',
    })),
    pharmacy: demoShoppingList.filter(item => item.listId === 'pharmacy').map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      checked: item.checked,
      category: item.category,
      listId: 'pharmacy',
    })),
  });
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  // Initialize dark mode - TOUJOURS SOMBRE
  const [darkMode] = useState(true);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
      
      // FORCER les styles inline pour override le navigateur
      document.documentElement.style.backgroundColor = 'black';
      document.documentElement.style.color = 'white';
      document.documentElement.style.colorScheme = 'dark';
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
      
      console.log('🌙 MODE SOMBRE ACTIVÉ - Fond: NOIR PUR (forcé avec !important)');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
      
      // FORCER les styles inline pour override le navigateur
      document.documentElement.style.backgroundColor = 'white';
      document.documentElement.style.color = 'black';
      document.documentElement.style.colorScheme = 'light';
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
      
      console.log('☀️ MODE CLAIR ACTIVÉ - Fond: BLANC PUR (forcé avec !important)');
    }
  }, [darkMode]);

  // Force initial light mode on first mount
  useEffect(() => {
    // S'assurer qu'on est bien en mode clair au démarrage si darkMode = false
    if (!darkMode) {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      console.log('✅ Vérification: Mode clair confirmé au montage du composant');
    } else {
      console.log('⚠️ Attention: Mode sombre détecté au montage');
    }
  }, []);

  // Check for existing session on mount and listen to auth changes
  useEffect(() => {
    // MODE DÉMO : Pas de test de connexion API
    console.log('Mode démo - pas de connexion serveur requise');
    
    checkSession();
    
    // Listen for auth state changes (non utilisé en mode démo, mais conservé pour compatibilité)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        apiClient.setToken(session.access_token);
        setIsAuthenticated(true);
      } else {
        apiClient.setToken(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // MODE DÉMO : Les données sont déjà chargées au démarrage
      // loadUserData();
      console.log('📦 Mode démo activé - utilisation des données locales');
      
      // Initialiser le système de notifications push
      const init = async () => {
        const notificationsInitialized = await initializeNotifications(products);
        if (notificationsInitialized) {
          console.log('✅ Système de notifications push initialisé');
        } else {
          console.log('ℹ️ Notifications push non activées');
        }
      };
      init();
    }
  }, [isAuthenticated, products]);

  // Notification for expiring products - separate effect
  useEffect(() => {
    if (isAuthenticated && products.length > 0) {
      // Vérifier les produits bientôt périmés et afficher une notification
      const expiringCount = products.filter(
        p => p.daysUntilExpiry !== undefined && p.daysUntilExpiry <= 3
      ).length;
      
      if (expiringCount > 0) {
        const timer = setTimeout(() => {
          toast.warning(
            `${expiringCount} produit${expiringCount > 1 ? 's' : ''} à consommer rapidement !`,
            {
              duration: 5000,
              position: 'top-center',
              action: {
                label: 'Voir',
                onClick: () => setActiveScreen('notifications'),
              },
            }
          );
        }, 1500); // Délai pour laisser l'app se charger
        
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, products.length]);

  const checkSession = async () => {
    try {
      // MODE DÉMO : Pas de session persistante, toujours déconnecté au démarrage
      console.log('Mode démo - pas de session persistante');
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      // Load profile
      const profileData = await apiClient.getProfile();
      setUser(profileData.user);
      setHousehold(profileData.household);
      setMembers(profileData.members || []);

      // Load products
      const productsData = await apiClient.getProducts();
      const productsWithExpiry = (productsData.products || []).map((p: any) => ({
        ...p,
        daysUntilExpiry: p.expiryDate ? calculateDaysUntilExpiry(p.expiryDate) : undefined,
      }));
      setProducts(productsWithExpiry);

      // Load shopping lists
      const listsData = await apiClient.getShoppingLists();
      // TODO: Implement shopping lists loading from API
      // setShoppingLists(listsData.shoppingLists || {});
    } catch (error: any) {
      console.error('Error loading user data:', error);
      // If unauthorized, logout the user
      if (error.message?.includes('Unauthorized')) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        handleLogout();
      }
    }
  };

  const calculateDaysUntilExpiry = (expiryDate: string): number => {
    const [day, month, year] = expiryDate.split('/').map(Number);
    const expiry = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAuth = async (email: string, password: string, name?: string, isSignup?: boolean) => {
    try {
      // MODE DÉMO : Connexion simplifiée sans serveur
      console.log('Mode démo - authentification locale');
      
      setUser({
        id: 'demo-user',
        email: email,
        name: name || 'Utilisateur Démo',
      });
      
      setHousehold({
        id: 'demo-household',
        name: 'Foyer Démo',
        createdBy: 'demo-user',
      });
      
      setMembers([{
        id: 'demo-user',
        email: email,
        name: name || 'Utilisateur Démo',
      }]);
      
      setIsAuthenticated(true);
      toast.success(isSignup ? 'Compte créé avec succès !' : 'Connexion réussie !');
      
    } catch (error: any) {
      console.error('Auth error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    // MODE DÉMO : Réinitialisation locale
    setIsAuthenticated(false);
    setUser(null);
    setHousehold(null);
    setMembers([]);
    setProducts(demoProducts);
    setShoppingLists({
      main: demoShoppingList.filter(item => !item.listId || item.listId === 'main').map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        checked: item.checked,
        category: item.category,
        listId: 'main',
      })),
      'next-week': demoShoppingList.filter(item => item.listId === 'next-week').map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        checked: item.checked,
        category: item.category,
        listId: 'next-week',
      })),
      pharmacy: demoShoppingList.filter(item => item.listId === 'pharmacy').map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        checked: item.checked,
        category: item.category,
        listId: 'pharmacy',
      })),
    });
    setActiveScreen('home');
    toast.success('Déconnexion réussie');
  };

  const handleCreateInvite = async (): Promise<string> => {
    console.log('handleCreateInvite appelé dans App.tsx');
    try {
      // MODE DÉMO : Génération d'un code d'invitation fictif
      const demoCode = 'KITCHIN' + Math.random().toString(36).substring(2, 8).toUpperCase();
      console.log('Code d\'invitation généré:', demoCode);
      
      toast.success('Code d\'invitation généré avec succès !', { 
        duration: 3000,
        position: 'top-center'
      });
      
      return demoCode;
    } catch (error) {
      console.error('Error creating invite:', error);
      toast.error('Erreur lors de la génération du code');
      throw error;
    }
  };

  const handleJoinHousehold = async (code: string) => {
    try {
      // MODE DÉMO : Fonctionnalité non disponible
      toast.info('Mode démo : Cette fonctionnalité nécessite un serveur', { duration: 3000 });
    } catch (error) {
      console.error('Error joining household:', error);
      toast.error('Erreur lors de la jonction au foyer');
      throw error;
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      // MODE DÉMO : Fonctionnalité non disponible
      toast.info('Mode démo : Cette fonctionnalité nécessite un serveur', { duration: 3000 });
    } catch (error: any) {
      console.error('Error removing member:', error);
      throw error;
    }
  };

  // Product handlers
  const handleUpdateQuantity = async (id: string, change: number) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      const newQuantity = Math.max(1, product.quantity + change);
      
      // MODE DÉMO : Mise à jour locale uniquement
      setProducts((prev) =>
        prev.map((p) => p.id === id ? { ...p, quantity: newQuantity } : p)
      );
    } catch (error) {
      console.error('Error updating product quantity:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      // MODE DÉMO : Suppression locale uniquement
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Produit supprimé');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Shopping list handlers
  const handleToggleItem = async (listId: string, id: string) => {
    try {
      // MODE DÉMO : Mise à jour locale uniquement
      setShoppingLists((prev) => ({
        ...prev,
        [listId]: prev[listId as keyof ShoppingLists].map((i) => 
          i.id === id ? { ...i, checked: !i.checked } : i
        ),
      }));
    } catch (error) {
      console.error('Error toggling shopping item:', error);
    }
  };

  const handleDeleteItem = async (listId: string, id: string) => {
    try {
      // MODE DÉMO : Suppression locale uniquement
      setShoppingLists((prev) => ({
        ...prev,
        [listId]: prev[listId as keyof ShoppingLists].filter((i) => i.id !== id),
      }));
      toast.success('Article supprimé');
    } catch (error) {
      console.error('Error deleting shopping item:', error);
    }
  };

  const handleAddItem = async (listId: string, name: string, quantity: string) => {
    try {
      // Détection automatique de la catégorie
      const detectCategory = (productName: string): string => {
        const lowerName = productName.toLowerCase();
        if (/(tomate|carotte|pomme|banane|orange|salade|légume|fruit|oignon|ail|pomme de terre|courgette|aubergine)/i.test(lowerName)) {
          return 'fruits-legumes';
        }
        if (/(poulet|viande|porc|bœuf|poisson|saumon|thon|jambon|steak)/i.test(lowerName)) {
          return 'viande-poisson';
        }
        if (/(lait|yaourt|fromage|beurre|crème|œuf)/i.test(lowerName)) {
          return 'produits-laitiers';
        }
        if (/(eau|jus|soda|café|thé|coca)/i.test(lowerName)) {
          return 'boissons';
        }
        if (/(surgelé|glace|légumes surgelés)/i.test(lowerName)) {
          return 'surgeles';
        }
        if (/(pâtes|riz|farine|sucre|sel|huile|sauce|conserve|pain)/i.test(lowerName)) {
          return 'epicerie';
        }
        return 'autres';
      };
      
      // MODE DÉMO : Ajout local uniquement
      const newItem = {
        id: `shop-demo-${Date.now()}`,
        name,
        quantity,
        checked: false,
        category: detectCategory(name),
        listId,
      };
      setShoppingLists((prev) => ({
        ...prev,
        [listId]: [...prev[listId as keyof ShoppingLists], newItem],
      }));
      toast.success('Article ajouté');
    } catch (error) {
      console.error('Error adding shopping item:', error);
    }
  };

  const handleMoveItem = async (itemId: string, fromListId: string, toListId: string) => {
    try {
      // Trouver l'article dans la liste source
      const item = shoppingLists[fromListId as keyof ShoppingLists].find(i => i.id === itemId);
      if (!item) return;

      // Supprimer de la liste source et ajouter à la liste destination
      setShoppingLists((prev) => ({
        ...prev,
        [fromListId]: prev[fromListId as keyof ShoppingLists].filter((i) => i.id !== itemId),
        [toListId]: [...prev[toListId as keyof ShoppingLists], { ...item, listId: toListId }],
      }));
      
      toast.success('Article déplacé');
    } catch (error) {
      console.error('Error moving shopping item:', error);
    }
  };

  const handleAddProduct = async (productData: {
    name: string;
    quantity: number;
    category: 'fridge' | 'pantry' | 'freezer';
    expiryDate?: string;
    image?: string;
  }) => {
    try {
      // Calculate daysUntilExpiry if expiry date provided
      let daysUntilExpiry: number | undefined;
      if (productData.expiryDate) {
        const [day, month, year] = productData.expiryDate.split('/').map(Number);
        const expiry = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffTime = expiry.getTime() - today.getTime();
        daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      // MODE DÉMO : Ajout local uniquement
      const newProduct = {
        id: `demo-${Date.now()}`,
        ...productData,
        daysUntilExpiry,
      };

      setProducts((prev) => [...prev, newProduct]);
      toast.success('Produit ajouté avec succès !');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
      throw error;
    }
  };

  const handleUpdateHouseholdName = async (name: string) => {
    try {
      // MODE DÉMO : Mise à jour locale uniquement
      setHousehold((prev: any) => ({ ...prev, name }));
      toast.success('Nom du foyer mis à jour');
    } catch (error: any) {
      console.error('Error updating household name:', error);
      throw error;
    }
  };

  const handleUpdateEmail = async (email: string) => {
    try {
      // MODE DÉMO : Mise à jour locale uniquement
      setUser((prev: any) => ({ ...prev, email }));
      toast.success('Email mis à jour');
    } catch (error: any) {
      console.error('Error updating email:', error);
      throw error;
    }
  };

  const handleAddSampleIngredients = async () => {
    const sampleIngredients = [
      // Frigo
      { name: 'Lait', quantity: 2, category: 'fridge' as const },
      { name: 'Œufs', quantity: 12, category: 'fridge' as const },
      { name: 'Beurre', quantity: 1, category: 'fridge' as const },
      { name: 'Fromage râpé', quantity: 1, category: 'fridge' as const },
      { name: 'Mozzarella', quantity: 2, category: 'fridge' as const },
      { name: 'Parmesan', quantity: 1, category: 'fridge' as const },
      { name: 'Crème fraîche', quantity: 2, category: 'fridge' as const },
      { name: 'Lardons', quantity: 1, category: 'fridge' as const },
      { name: 'Poulet', quantity: 1, category: 'fridge' as const },
      { name: 'Viande hachée', quantity: 1, category: 'fridge' as const },
      { name: 'Carottes', quantity: 5, category: 'fridge' as const },
      { name: 'Tomates', quantity: 6, category: 'fridge' as const },
      { name: 'Oignon', quantity: 4, category: 'fridge' as const },
      { name: 'Ail', quantity: 1, category: 'fridge' as const },
      { name: 'Laitue romaine', quantity: 2, category: 'fridge' as const },
      { name: 'Courgettes', quantity: 3, category: 'fridge' as const },
      { name: 'Poivrons', quantity: 2, category: 'fridge' as const },
      { name: 'Aubergines', quantity: 2, category: 'fridge' as const },
      { name: 'Citron', quantity: 3, category: 'fridge' as const },
      { name: 'Pommes', quantity: 6, category: 'fridge' as const },
      { name: 'Mascarpone', quantity: 1, category: 'fridge' as const },
      
      // Placard
      { name: 'Spaghetti', quantity: 2, category: 'pantry' as const },
      { name: 'Pâtes', quantity: 3, category: 'pantry' as const },
      { name: 'Riz', quantity: 2, category: 'pantry' as const },
      { name: 'Farine', quantity: 1, category: 'pantry' as const },
      { name: 'Sucre', quantity: 1, category: 'pantry' as const },
      { name: 'Sel', quantity: 1, category: 'pantry' as const },
      { name: 'Poivre', quantity: 1, category: 'pantry' as const },
      { name: 'Huile d\'olive', quantity: 1, category: 'pantry' as const },
      { name: 'Sauce tomate', quantity: 3, category: 'pantry' as const },
      { name: 'Chocolat noir', quantity: 2, category: 'pantry' as const },
      { name: 'Lait de coco', quantity: 2, category: 'pantry' as const },
      { name: 'Curry en poudre', quantity: 1, category: 'pantry' as const },
      { name: 'Herbes de Provence', quantity: 1, category: 'pantry' as const },
      { name: 'Thym', quantity: 1, category: 'pantry' as const },
      { name: 'Romarin', quantity: 1, category: 'pantry' as const },
      { name: 'Basilic', quantity: 1, category: 'pantry' as const },
      { name: 'Origan', quantity: 1, category: 'pantry' as const },
      { name: 'Cannelle', quantity: 1, category: 'pantry' as const },
      { name: 'Muscade', quantity: 1, category: 'pantry' as const },
      { name: 'Levure chimique', quantity: 1, category: 'pantry' as const },
      { name: 'Café', quantity: 1, category: 'pantry' as const },
      { name: 'Cacao en poudre', quantity: 1, category: 'pantry' as const },
      { name: 'Confiture d\'abricot', quantity: 1, category: 'pantry' as const },
      { name: 'Biscuits à la cuillère', quantity: 1, category: 'pantry' as const },
      
      // Congélateur
      { name: 'Pommes de terre', quantity: 3, category: 'freezer' as const },
      { name: 'Steaks de bœuf', quantity: 4, category: 'freezer' as const },
    ];

    try {
      toast.info('Ajout des ingrédients en cours...');
      
      for (const ingredient of sampleIngredients) {
        try {
          await handleAddProduct(ingredient);
          // Small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error adding ${ingredient.name}:`, error);
        }
      }
      
      toast.success('Ingrédients de base ajoutés avec succès !');
    } catch (error) {
      console.error('Error adding sample ingredients:', error);
      toast.error('Erreur lors de l\'ajout des ingrédients');
    }
  };

  // Get expiring products (within 3 days)
  const expiringProducts = products
    .filter((p) => p.daysUntilExpiry !== undefined && p.daysUntilExpiry <= 3)
    .slice(0, 4);

  // Get fridge products for home screen
  const fridgeProducts = products.filter((p) => p.category === 'fridge').slice(0, 4);

  if (loading) {
    return (
      <div 
        className="h-screen flex items-center justify-center bg-gray-900"
        style={{ backgroundColor: '#1f2937', height: '100vh' }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <ThemeProvider>
      <div 
        className="min-h-screen w-full bg-gray-900 relative"
        style={{
          backgroundColor: '#1f2937',
          color: '#f1f5f9',
          minHeight: '100vh'
        }}
      >
      {/* Bannière Mode Démo */}
      <div className="bg-blue-500 text-white text-center py-2 px-4 text-sm sticky top-0 z-50 md:ml-64">
        <span className="inline-flex items-center gap-3">
          <span>📱</span>
          <span>Mode Démo - Données locales</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full">
            🌙
            <span className="text-xs">Mode Sombre</span>
          </span>
        </span>
      </div>
      
      {/* Main Content Area */}
      <div className="md:ml-64">
        <div className="max-w-7xl mx-auto">
          {activeScreen === 'home' && (
            <HomeScreen
              expiringProducts={expiringProducts}
              fridgeProducts={fridgeProducts}
              household={household}
              onProfileClick={() => setActiveScreen('profile')}
              onInviteClick={() => setActiveScreen('profile')}
              onViewAllExpiring={() => setActiveScreen('inventory')}
              onViewAllFridge={() => setActiveScreen('inventory')}
              onNotificationsClick={() => setActiveScreen('notifications')}
            />
          )}
          {activeScreen === 'notifications' && (
            <NotificationsScreen
              products={products}
              onBack={() => setActiveScreen('home')}
              onNavigateToInventory={() => setActiveScreen('inventory')}
            />
          )}
          {activeScreen === 'inventory' && (
            <InventoryScreen
              products={products}
              onBack={() => setActiveScreen('home')}
              onUpdateQuantity={handleUpdateQuantity}
              onDeleteProduct={handleDeleteProduct}
              onAddProduct={() => setActiveScreen('add-product')}
              onAddSampleIngredients={handleAddSampleIngredients}
            />
          )}
          {activeScreen === 'add-product' && (
            <AddProductScreen
              onBack={() => setActiveScreen('inventory')}
              onSave={handleAddProduct}
            />
          )}
          {activeScreen === 'lists' && (
            <ShoppingListScreen
              lists={shoppingLists}
              onBack={() => setActiveScreen('home')}
              onToggleItem={handleToggleItem}
              onDeleteItem={handleDeleteItem}
              onAddItem={handleAddItem}
              onMoveItem={handleMoveItem}
            />
          )}
          {activeScreen === 'profile' && (
            <ProfileScreen
              user={user}
              household={household}
              members={members}
              onBack={() => setActiveScreen('home')}
              onLogout={handleLogout}
              onCreateInvite={handleCreateInvite}
              onJoinHousehold={handleJoinHousehold}
              onRemoveMember={handleRemoveMember}
              onSettingsClick={() => setActiveScreen('settings')}
            />
          )}
          {activeScreen === 'settings' && (
            <SettingsScreen
              user={user}
              household={household}
              onBack={() => setActiveScreen('profile')}
              onUpdateHouseholdName={handleUpdateHouseholdName}
              onUpdateEmail={handleUpdateEmail}
            />
          )}
          {activeScreen === 'recipes' && !selectedRecipe && (
            <RecipesScreen
              onRecipeClick={(recipe) => setSelectedRecipe(recipe)}
              availableProducts={products}
            />
          )}
          {activeScreen === 'recipes' && selectedRecipe && (
            <RecipeDetailScreen
              recipe={selectedRecipe}
              onBack={() => setSelectedRecipe(null)}
              availableProducts={products}
            />
          )}
        </div>
      </div>

      {/* Responsive Navigation */}
      <ResponsiveNav
        activeScreen={activeScreen}
        onNavigate={(screen) => {
          setSelectedRecipe(null);
          setActiveScreen(screen);
        }}
        notificationCount={expiringProducts.length}
      />

      {/* Toast Notifications */}
      <Toaster position="top-center" theme="dark" />
      </div>
    </ThemeProvider>
  );
}