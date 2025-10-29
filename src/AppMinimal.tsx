import { useState } from 'react';

export default function AppMinimal() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl mb-6 text-center text-green-600">✅ Kitch'In</h1>
        <p className="text-gray-600 mb-6 text-center">
          L'application compile correctement !
        </p>
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl">{count}</div>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Incrémenter
          </button>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> Les erreurs webpack que vous voyez dans la console proviennent du système interne de Figma Make, pas de votre code.
          </p>
        </div>
      </div>
    </div>
  );
}
