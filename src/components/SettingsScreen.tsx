import { ArrowLeft, Users, Mail, Edit2, Check, Bell, BellOff, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { useThemeStyles } from '../contexts/ThemeContext';
import {
  getNotificationPermission,
  requestNotificationPermission,
  loadNotificationPreferences,
  saveNotificationPreferences,
  testNotification,
  isNotificationSupported,
} from '../utils/notifications';

interface SettingsScreenProps {
  user: any;
  household: any;
  onBack: () => void;
  onUpdateHouseholdName?: (name: string) => Promise<void>;
  onUpdateEmail?: (email: string) => Promise<void>;
}

export function SettingsScreen({
  user,
  household,
  onBack,
  onUpdateHouseholdName,
  onUpdateEmail,
}: SettingsScreenProps) {
  const [isEditingHousehold, setIsEditingHousehold] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [householdName, setHouseholdName] = useState(household?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<'default' | 'granted' | 'denied'>('default');
  const [notificationPreferences, setNotificationPreferences] = useState({
    enabled: false,
    dailyTime: 9,
    instantAlerts: true,
  });

  useEffect(() => {
    // Charger le statut de permission
    const checkPermission = async () => {
      const permission = getNotificationPermission();
      if (permission.granted) {
        setNotificationPermission('granted');
      } else if (permission.denied) {
        setNotificationPermission('denied');
      } else {
        setNotificationPermission('default');
      }
    };
    checkPermission();

    // Charger les préférences
    const prefs = loadNotificationPreferences();
    setNotificationPreferences(prefs);
  }, []);

  const handleSaveHouseholdName = async () => {
    if (!householdName.trim()) {
      toast.error('Le nom du foyer ne peut pas être vide');
      return;
    }

    setLoading(true);
    try {
      if (onUpdateHouseholdName) {
        await onUpdateHouseholdName(householdName.trim());
        toast.success('Nom du foyer mis à jour');
      } else {
        // Mode démo - mise à jour locale uniquement
        toast.success('Nom du foyer mis à jour (mode démo)');
      }
      setIsEditingHousehold(false);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Email invalide');
      return;
    }

    setLoading(true);
    try {
      if (onUpdateEmail) {
        await onUpdateEmail(email.trim());
        toast.success('Email mis à jour');
      } else {
        // Mode démo - mise à jour locale uniquement
        toast.success('Email mis à jour (mode démo)');
      }
      setIsEditingEmail(false);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled && notificationPermission !== 'granted') {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast.error('Permission de notification refusée');
        return;
      }
      setNotificationPermission('granted');
    }
    
    const newPrefs = { ...notificationPreferences, enabled };
    setNotificationPreferences(newPrefs);
    saveNotificationPreferences(newPrefs);
    toast.success(enabled ? 'Notifications activées' : 'Notifications désactivées');
    
    // Recharger la page pour appliquer les changements
    if (enabled) {
      window.location.reload();
    }
  };

  const handleToggleInstantAlerts = async (enabled: boolean) => {
    const newPrefs = { ...notificationPreferences, instantAlerts: enabled };
    setNotificationPreferences(newPrefs);
    saveNotificationPreferences(newPrefs);
    toast.success(enabled ? 'Alertes instantanées activées' : 'Alertes instantanées désactivées');
  };

  const handleChangeDailyTime = async (time: number) => {
    const newPrefs = { ...notificationPreferences, dailyTime: time };
    setNotificationPreferences(newPrefs);
    saveNotificationPreferences(newPrefs);
    toast.success(`Rappel quotidien programmé à ${time}h`);
  };

  const handleTestNotification = async () => {
    if (notificationPermission === 'granted') {
      await testNotification();
    } else {
      toast.error('Permission de notification non accordée');
    }
  };

  const requestPermission = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
  };

  const styles = useThemeStyles();

  return (
    <div className="flex flex-col h-screen bg-gray-900" style={styles.background}>
      {/* Header */}
      <header 
        className="bg-white dark:bg-gray-800 px-6 py-4 shadow-sm flex-shrink-0 transition-colors"
        style={styles.header}
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-gray-900 dark:text-white">
            Paramètres
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <div className="max-w-md mx-auto space-y-6">

          {/* Household Section */}
          <section 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors"
            style={styles.card}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-gray-900 dark:text-white">
                Mon Foyer
              </h3>
            </div>

            {/* Household Name */}
            <div>
              <Label htmlFor="household-name" className="text-gray-700 dark:text-gray-300">
                Nom du foyer
              </Label>
              {isEditingHousehold ? (
                <div className="flex gap-2 mt-2">
                  <Input
                    id="household-name"
                    type="text"
                    value={householdName}
                    onChange={(e) => setHouseholdName(e.target.value)}
                    className="flex-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="Ex: Famille Dupont"
                  />
                  <button
                    onClick={handleSaveHouseholdName}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingHousehold(false);
                      setHouseholdName(household?.name || '');
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white">
                    {household?.name || 'Aucun foyer'}
                  </p>
                  <button
                    onClick={() => setIsEditingHousehold(true)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Account Section */}
          <section 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors"
            style={styles.card}
          >
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-gray-900 dark:text-white">
                Mon Compte
              </h3>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Adresse email
              </Label>
              {isEditingEmail ? (
                <div className="flex gap-2 mt-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="exemple@email.com"
                  />
                  <button
                    onClick={handleSaveEmail}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingEmail(false);
                      setEmail(user?.email || '');
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white">
                    {user?.email || 'Non défini'}
                  </p>
                  <button
                    onClick={() => setIsEditingEmail(true)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Notifications Section */}
          <section 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors"
            style={styles.card}
          >
            <div className="flex items-center gap-2 mb-4">
              {notificationPreferences.enabled ? (
                <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
              <h3 className="text-gray-900 dark:text-white">
                Notifications Push
              </h3>
            </div>

            {!isNotificationSupported() ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">
                  ⚠️ Les notifications ne sont pas supportées sur cet appareil
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Permission Status */}
                {notificationPermission === 'denied' && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      🚫 Permission refusée. Veuillez autoriser les notifications dans les paramètres de votre navigateur.
                    </p>
                  </div>
                )}

                {/* Enable/Disable Notifications */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-gray-900 dark:text-white">
                      Activer les notifications
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recevoir des alertes sur vos produits
                    </p>
                  </div>
                  <Switch
                    checked={notificationPreferences.enabled}
                    onCheckedChange={handleToggleNotifications}
                    disabled={notificationPermission === 'denied'}
                  />
                </div>

                {/* Instant Alerts */}
                {notificationPreferences.enabled && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-gray-900 dark:text-white">
                        Alertes instantanées
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Produits périmés aujourd'hui ou demain
                      </p>
                    </div>
                    <Switch
                      checked={notificationPreferences.instantAlerts}
                      onCheckedChange={handleToggleInstantAlerts}
                    />
                  </div>
                )}

                {/* Daily Time */}
                {notificationPreferences.enabled && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      <Label className="text-gray-900 dark:text-white">
                        Rappel quotidien
                      </Label>
                    </div>
                    <select
                      value={notificationPreferences.dailyTime}
                      onChange={(e) => handleChangeDailyTime(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white rounded-lg"
                    >
                      <option value={7}>7h00 - Tôt le matin</option>
                      <option value={8}>8h00 - Matin</option>
                      <option value={9}>9h00 - Milieu de matinée</option>
                      <option value={10}>10h00</option>
                      <option value={11}>11h00</option>
                      <option value={12}>12h00 - Midi</option>
                      <option value={18}>18h00 - Début de soirée</option>
                      <option value={19}>19h00 - Soirée</option>
                      <option value={20}>20h00</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Vous recevrez un résumé quotidien des produits à consommer
                    </p>
                  </div>
                )}

                {/* Test Notification */}
                {notificationPermission === 'granted' && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={handleTestNotification}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Tester une notification</span>
                    </button>
                  </div>
                )}

                {/* Request Permission Button */}
                {notificationPermission === 'default' && !notificationPreferences.enabled && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={requestPermission}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Autoriser les notifications</span>
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Nécessaire pour recevoir des alertes
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* App Info */}
          <section 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors"
            style={styles.card}
          >
            <h3 className="text-gray-900 dark:text-white mb-3">
              À propos
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Version</span>
                <span className="text-gray-900 dark:text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Mode</span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                  Démo
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}