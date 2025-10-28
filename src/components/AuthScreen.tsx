import { useState } from 'react';
import { LogIn, Zap } from 'lucide-react';

interface AuthScreenProps {
  onAuth: (email: string, password: string, name?: string, isSignup?: boolean) => Promise<void>;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onAuth(email, password, name, isSignup);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = async () => {
    setError('');
    setLoading(true);

    try {
      await onAuth('demo@kitchin.app', 'demo123', 'Utilisateur Démo', false);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-green-700 mb-2">Kitch'In</h1>
          <p className="text-gray-600">Gérez votre cuisine en famille</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-gray-800 text-center mb-6">
            {isSignup ? 'Créer un compte' : 'Se connecter'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm text-gray-700 mb-1" style={{ color: '#374151', WebkitTextFillColor: '#374151' }}>
                  Nom complet
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Jean Dupont"
                  style={{ WebkitTextFillColor: '#111827', color: '#111827' }}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-1" style={{ color: '#374151', WebkitTextFillColor: '#374151' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="email@exemple.com"
                style={{ WebkitTextFillColor: '#111827', color: '#111827' }}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1" style={{ color: '#374151', WebkitTextFillColor: '#374151' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="••••••••"
                style={{ WebkitTextFillColor: '#111827', color: '#111827' }}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm" style={{ color: '#dc2626', WebkitTextFillColor: '#dc2626' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
            >
              <LogIn className="w-5 h-5" />
              {loading
                ? 'Chargement...'
                : isSignup
                ? 'Créer mon compte'
                : 'Se connecter'}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500" style={{ color: '#6b7280', WebkitTextFillColor: '#6b7280' }}>
                  ou
                </span>
              </div>
            </div>

            {/* Demo Mode Button */}
            <button
              type="button"
              onClick={handleDemoMode}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
            >
              <Zap className="w-5 h-5" />
              <span>Accès rapide - Mode Démo</span>
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
              style={{ color: '#2563eb', WebkitTextFillColor: '#2563eb' }}
            >
              {isSignup
                ? 'Déjà un compte ? Se connecter'
                : 'Pas encore de compte ? S\'inscrire'}
            </button>
            
            {!isSignup && error.includes('incorrect') && (
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2" style={{ color: '#6b7280', WebkitTextFillColor: '#6b7280' }}>Première visite ?</p>
                <button
                  onClick={() => {
                    setIsSignup(true);
                    setError('');
                  }}
                  className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  style={{ color: '#374151', WebkitTextFillColor: '#374151' }}
                >
                  Créer un nouveau compte
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          En vous inscrivant, vous acceptez de partager vos données avec votre foyer
        </p>
      </div>
    </div>
  );
}
