import { ArrowLeft, Users, Copy, LogOut, UserPlus, Check, UserX, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface Member {
  id: string;
  name: string;
  email: string;
}

interface Household {
  id: string;
  name: string;
}

interface ProfileScreenProps {
  user: any;
  household: (Household & { createdBy?: string }) | null;
  members: Member[];
  onBack: () => void;
  onLogout: () => void;
  onCreateInvite: () => Promise<string>;
  onJoinHousehold: (code: string) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onSettingsClick?: () => void;
}

export function ProfileScreen({
  user,
  household,
  members,
  onBack,
  onLogout,
  onCreateInvite,
  onJoinHousehold,
  onRemoveMember,
  onSettingsClick,
}: ProfileScreenProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Check if current user is the household owner
  const isOwner = household?.createdBy === user?.id;

  const handleCreateInvite = async () => {
    console.log('Bouton Inviter cliqué');
    setLoading(true);
    try {
      const code = await onCreateInvite();
      setInviteCode(code);
      setShowInvite(true);
      console.log('Code d\'invitation reçu:', code);
    } catch (error) {
      console.error('Error creating invite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success('Code copié dans le presse-papiers !', { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinHousehold = async () => {
    if (!joinCode.trim()) return;
    setLoading(true);
    try {
      await onJoinHousehold(joinCode.trim());
      setShowJoin(false);
      setJoinCode('');
    } catch (error) {
      console.error('Error joining household:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir retirer ${memberName} du foyer ?`)) {
      return;
    }
    
    setLoading(true);
    try {
      await onRemoveMember(memberId);
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Erreur lors du retrait du membre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5faf7] dark:bg-gray-900 transition-colors">
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
            Mon Profil
          </h1>
          <div className="flex items-center gap-2">
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Paramètres"
              >
                <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* User Info */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
            <h3 className="text-gray-900 dark:text-white mb-4">
              Mes informations
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nom
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>
          </section>

          {/* Household Info */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 dark:text-white">
                Mon Foyer
              </h3>
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nom du foyer
              </p>
              <p className="text-gray-900 dark:text-white">
                {household?.name || 'Aucun foyer'}
              </p>
            </div>

            {/* Members List */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Membres ({members.length})
              </p>
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-700 dark:text-green-300">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900 dark:text-white text-sm">
                          {member.name}
                        </p>
                        {member.id === household?.createdBy && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                            Propriétaire
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {member.email}
                      </p>
                    </div>
                    
                    {/* Remove button - only visible to owner and not for themselves */}
                    {isOwner && member.id !== user?.id && (
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        disabled={loading}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                        title="Retirer ce membre"
                      >
                        <UserX className="w-5 h-5 text-red-500 dark:text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Invite Section */}
            <div className="space-y-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Clic sur bouton Inviter détecté');
                  handleCreateInvite();
                }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer active:scale-95 transform"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <UserPlus className="w-5 h-5" />
                <span className="text-white" style={{ WebkitTextFillColor: '#ffffff', color: '#ffffff' }}>
                  Inviter un membre
                </span>
              </button>

              {showInvite && inviteCode && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-5 rounded-xl border border-green-200 dark:border-green-700 shadow-sm transition-colors relative">
                  <button
                    onClick={() => setShowInvite(false)}
                    className="absolute top-3 right-3 p-1 hover:bg-green-200 dark:hover:bg-green-700 rounded-full transition-colors"
                    title="Fermer"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-gray-900 dark:text-white">
                      Code d'invitation généré !
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Code d'invitation */}
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Code d'invitation :
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border-2 border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 text-lg tracking-wider text-center select-all">
                          {inviteCode.slice(0, 9)}-{inviteCode.slice(9)}
                        </code>
                        <button
                          onClick={handleCopyCode}
                          className="p-3 bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg border-2 border-green-300 dark:border-green-600 transition-colors"
                          title="Copier le code"
                        >
                          {copied ? (
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5 text-green-600 dark:text-green-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Lien d'invitation */}
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Ou partagez ce lien :
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-green-200 dark:border-green-700 overflow-hidden">
                          <p className="text-xs text-green-700 dark:text-green-400 truncate">
                            https://kitchin.app/join/{inviteCode}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`https://kitchin.app/join/${inviteCode}`);
                            toast.success('Lien copié !', { duration: 2000 });
                          }}
                          className="p-2 bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg border border-green-200 dark:border-green-700 transition-colors"
                          title="Copier le lien"
                        >
                          <Copy className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 pt-2">
                      <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                        <svg className="w-full h-full text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Partagez ce code ou ce lien avec votre proche. Le code expire dans 7 jours. En mode démo, le code est purement illustratif.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowJoin(!showJoin)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Users className="w-5 h-5" />
                Rejoindre un foyer
              </button>

              {showJoin && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    Entrez le code d'invitation :
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="ABC123"
                      className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase bg-white text-gray-900 placeholder:text-gray-400"
                      style={{ WebkitTextFillColor: '#111827', color: '#111827' }}
                      maxLength={6}
                    />
                    <button
                      onClick={handleJoinHousehold}
                      disabled={loading || !joinCode.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      Rejoindre
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}