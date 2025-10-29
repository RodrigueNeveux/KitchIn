import { ArrowLeft, Moon, Sun, Users, Mail, Edit2, Check } from 'lucide-react';
import { useState } from 'react';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from "sonner";

interface SettingsScreenProps {
  user: any;
  household: any;
  onBack: () => void;
  onUpdateHouseholdName?: (name: string) => Promise<void>;
  onUpdateEmail?: (email: string) => Promise<void>;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function SettingsScreen({
  user,
  household,
  onBack,
  onUpdateHouseholdName,
  onUpdateEmail,
  darkMode,
  onToggleDarkMode,
}: SettingsScreenProps) {
  const [isEditingHousehold, setIsEditingHousehold] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [householdName, setHouseholdName] = useState(household?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

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
            Paramètres
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <div className="max-w-md mx-auto space-y-6">
          {/* Appearance Section */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
            <h3 className="text-gray-900 dark:text-white mb-4">
              Apparence
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-600" />
                )}
                <div>
                  <p className="text-gray-900 dark:text-white">
                    Mode sombre
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {darkMode ? 'Activé' : 'Désactivé'}
                  </p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={onToggleDarkMode}
              />
            </div>
          </section>

          {/* Household Section */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
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
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
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

          {/* App Info */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
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
