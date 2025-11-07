// Système de notifications push pour Kitch'In

export interface NotificationPermissionStatus {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export interface Product {
  id: string;
  name: string;
  daysUntilExpiry?: number;
  expiryDate?: string;
  category: string;
}

// Vérifier si les notifications sont supportées
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Obtenir le statut de la permission
export const getNotificationPermission = (): NotificationPermissionStatus => {
  if (!isNotificationSupported()) {
    return { granted: false, denied: true, default: false };
  }

  const permission = Notification.permission;
  return {
    granted: permission === 'granted',
    denied: permission === 'denied',
    default: permission === 'default',
  };
};

// Demander la permission de notification
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    console.warn('Les notifications ne sont pas supportées sur cet appareil');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('🔔 Permission de notification:', permission);
    return permission === 'granted';
  } catch (error) {
    console.error('Erreur lors de la demande de permission:', error);
    return false;
  }
};

// Enregistrer le Service Worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker non supporté');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('✅ Service Worker enregistré:', registration);
    return registration;
  } catch (error) {
    console.error('❌ Erreur d\'enregistrement du Service Worker:', error);
    return null;
  }
};

// Envoyer une notification immédiate
export const sendNotification = async (
  title: string,
  options: NotificationOptions & { data?: any } = {}
): Promise<void> => {
  if (!isNotificationSupported()) {
    console.warn('Notifications non supportées');
    return;
  }

  const permission = await getNotificationPermission();
  if (!permission.granted) {
    console.warn('Permission de notification non accordée');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      vibrate: [200, 100, 200],
      ...options,
    });
    console.log('🔔 Notification envoyée:', title);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
  }
};

// Vérifier les produits périmés et envoyer des notifications
export const checkExpiringProducts = async (products: Product[]): Promise<void> => {
  const permission = await getNotificationPermission();
  if (!permission.granted) return;

  // Produits expirés aujourd'hui
  const expiredToday = products.filter(p => p.daysUntilExpiry === 0);
  
  // Produits qui expirent demain
  const expiringTomorrow = products.filter(p => p.daysUntilExpiry === 1);
  
  // Produits qui expirent dans 2-3 jours
  const expiringSoon = products.filter(p => p.daysUntilExpiry && p.daysUntilExpiry >= 2 && p.daysUntilExpiry <= 3);

  // Notification pour les produits expirés aujourd'hui (URGENT)
  if (expiredToday.length > 0) {
    await sendNotification('🚨 Produits à consommer AUJOURD\'HUI !', {
      body: `${expiredToday.length} produit${expiredToday.length > 1 ? 's' : ''} expire${expiredToday.length > 1 ? 'nt' : ''} aujourd'hui : ${expiredToday.slice(0, 3).map(p => p.name).join(', ')}${expiredToday.length > 3 ? '...' : ''}`,
      tag: 'expired-today',
      requireInteraction: true,
      data: { url: '/#/notifications' },
      actions: [
        { action: 'view', title: 'Voir les produits' },
        { action: 'dismiss', title: 'Plus tard' },
      ],
    });
  }

  // Notification pour les produits qui expirent demain
  if (expiringTomorrow.length > 0) {
    await sendNotification('⚠️ Produits à consommer demain', {
      body: `${expiringTomorrow.length} produit${expiringTomorrow.length > 1 ? 's' : ''} à consommer demain : ${expiringTomorrow.slice(0, 3).map(p => p.name).join(', ')}${expiringTomorrow.length > 3 ? '...' : ''}`,
      tag: 'expiring-tomorrow',
      data: { url: '/#/notifications' },
    });
  }

  // Notification quotidienne générale (si des produits expirent bientôt)
  const totalExpiring = expiredToday.length + expiringTomorrow.length + expiringSoon.length;
  if (totalExpiring > 0) {
    await sendNotification('🍽️ Kitch\'In - Rappel du jour', {
      body: `Vous avez ${totalExpiring} produit${totalExpiring > 1 ? 's' : ''} à consommer rapidement pour éviter le gaspillage.`,
      tag: 'daily-reminder',
      data: { url: '/#/notifications' },
    });
  }
};

// Planifier une notification quotidienne
export const scheduleDailyNotification = (
  products: Product[],
  hour: number = 9 // 9h par défaut
): void => {
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hour, 0, 0, 0);

  // Si l'heure est déjà passée aujourd'hui, planifier pour demain
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  console.log(`⏰ Notification quotidienne planifiée pour ${scheduledTime.toLocaleString('fr-FR')}`);

  // Planifier la notification
  setTimeout(async () => {
    await checkExpiringProducts(products);
    // Replanifier pour le jour suivant
    scheduleDailyNotification(products, hour);
  }, timeUntilNotification);
};

// Sauvegarder les préférences de notification dans localStorage
export const saveNotificationPreferences = (preferences: {
  enabled: boolean;
  dailyTime: number;
  instantAlerts: boolean;
}): void => {
  localStorage.setItem('kitchin-notifications', JSON.stringify(preferences));
  console.log('💾 Préférences de notification sauvegardées:', preferences);
};

// Charger les préférences de notification
export const loadNotificationPreferences = (): {
  enabled: boolean;
  dailyTime: number;
  instantAlerts: boolean;
} => {
  const saved = localStorage.getItem('kitchin-notifications');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  }
  
  // Valeurs par défaut
  return {
    enabled: false,
    dailyTime: 9, // 9h du matin
    instantAlerts: true,
  };
};

// Initialiser le système de notifications
export const initializeNotifications = async (products: Product[]): Promise<boolean> => {
  console.log('🚀 Initialisation du système de notifications...');
  
  if (!isNotificationSupported()) {
    console.warn('⚠️ Notifications non supportées sur cet appareil');
    return false;
  }

  // Enregistrer le Service Worker
  const registration = await registerServiceWorker();
  if (!registration) {
    console.error('❌ Impossible d\'enregistrer le Service Worker');
    return false;
  }

  // Charger les préférences
  const preferences = loadNotificationPreferences();
  
  if (preferences.enabled) {
    const permission = await getNotificationPermission();
    
    if (permission.granted) {
      console.log('✅ Notifications activées');
      
      // Planifier la notification quotidienne
      scheduleDailyNotification(products, preferences.dailyTime);
      
      // Vérifier immédiatement s'il y a des produits urgents
      if (preferences.instantAlerts) {
        const urgentProducts = products.filter(p => p.daysUntilExpiry !== undefined && p.daysUntilExpiry <= 1);
        if (urgentProducts.length > 0) {
          setTimeout(() => checkExpiringProducts(products), 2000); // Attendre 2s après le chargement
        }
      }
      
      return true;
    }
  }
  
  return false;
};

// Tester les notifications (pour déboguer)
export const testNotification = async (): Promise<void> => {
  await sendNotification('🧪 Test - Kitch\'In', {
    body: 'Les notifications fonctionnent correctement ! 🎉',
    tag: 'test-notification',
    data: { url: '/' },
  });
};
