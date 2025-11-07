import { ArrowLeft, Save, Camera, Barcode } from 'lucide-react';
import { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { getProductByBarcode } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { useThemeStyles } from '../contexts/ThemeContext';

interface AddProductScreenProps {
  onBack: () => void;
  onSave: (product: {
    name: string;
    quantity: number;
    category: 'fridge' | 'pantry' | 'freezer';
    expiryDate?: string;
    image?: string;
  }) => Promise<void>;
}

export function AddProductScreen({ onBack, onSave }: AddProductScreenProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState<'fridge' | 'pantry' | 'freezer'>('fridge');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [productImage, setProductImage] = useState<string | undefined>(undefined);

  const handleBarcodeScanned = async (barcode: string) => {
    toast.info(`Code-barres scanné: ${barcode}`, {
      description: 'Recherche des informations du produit...',
    });

    const productInfo = await getProductByBarcode(barcode);
    
    if (productInfo) {
      setName(productInfo.brand ? `${productInfo.brand} ${productInfo.name}` : productInfo.name);
      setCategory(productInfo.category);
      if (productInfo.image) {
        setProductImage(productInfo.image);
      }
      toast.success('Produit trouvé !', {
        description: 'Les informations ont été pré-remplies. Vous pouvez les modifier si nécessaire.',
      });
    } else {
      toast.error('Produit non trouvé', {
        description: 'Veuillez entrer les informations manuellement.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Le nom du produit est requis');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum < 1) {
      setError('La quantité doit être au moins 1');
      return;
    }

    setLoading(true);
    try {
      // Calculate days until expiry if date is provided
      let daysUntilExpiry: number | undefined;
      if (expiryDate) {
        const expiry = new Date(expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffTime = expiry.getTime() - today.getTime();
        daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      // Format expiry date to DD/MM/YYYY
      const formattedDate = expiryDate
        ? new Date(expiryDate).toLocaleDateString('fr-FR')
        : undefined;

      await onSave({
        name: name.trim(),
        quantity: quantityNum,
        category,
        expiryDate: formattedDate,
        image: productImage,
      });

      // Reset form
      setName('');
      setQuantity('1');
      setCategory('fridge');
      setExpiryDate('');
      setProductImage(undefined);
      onBack();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
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
            Ajouter un produit
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 pb-6">
          {/* Scanner Button */}
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Barcode className="w-5 h-5" />
            Scanner un code-barres
          </button>

          {/* Product Image */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-3 overflow-hidden">
              {productImage ? (
                <img src={productImage} alt={name} className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <button
              type="button"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
            >
              Ajouter une photo
            </button>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label 
              htmlFor="name" 
              className="text-gray-700 dark:text-gray-300"
              style={styles.textSecondary}
            >
              Nom du produit *
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Yaourts nature, Tomates..."
              className="bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              style={{
                ...styles.input,
                color: styles.input.color,
                backgroundColor: styles.input.backgroundColor,
              }}
              required
            />
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label 
              htmlFor="quantity" 
              className="text-gray-700 dark:text-gray-300"
              style={styles.textSecondary}
            >
              Quantité *
            </Label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(String(Math.max(1, parseInt(quantity || '1') - 1)))}
                className="w-12 h-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors active:bg-gray-100 dark:active:bg-gray-500 text-gray-700 dark:text-gray-200"
                style={{ 
                  ...styles.input,
                  fontSize: '24px',
                  lineHeight: '24px',
                  minHeight: '48px',
                  minWidth: '48px',
                  textAlign: 'center' as const
                } as React.CSSProperties}
              >
                −
              </button>
              <Input
                id="quantity"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setQuantity(val || '1');
                }}
                className="bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 flex-1 force-text-visible"
                style={{ 
                  ...styles.input,
                  textAlign: 'center' as const,
                  fontSize: '18px',
                  fontWeight: '600',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  opacity: 1,
                  minHeight: '48px',
                  lineHeight: '48px',
                  color: styles.input.color,
                  backgroundColor: styles.input.backgroundColor,
                } as React.CSSProperties}
                required
              />
              <button
                type="button"
                onClick={() => setQuantity(String(parseInt(quantity || '1') + 1))}
                className="w-12 h-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors active:bg-gray-100 dark:active:bg-gray-500 text-gray-700 dark:text-gray-200"
                style={{ 
                  ...styles.input,
                  fontSize: '24px',
                  lineHeight: '24px',
                  minHeight: '48px',
                  minWidth: '48px',
                  textAlign: 'center' as const
                } as React.CSSProperties}
              >
                +
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label 
              htmlFor="category" 
              className="text-gray-700 dark:text-gray-300"
              style={styles.textSecondary}
            >
              Emplacement *
            </Label>
            <Select value={category} onValueChange={(value: any) => setCategory(value)}>
              <SelectTrigger 
                className="bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                style={{
                  ...styles.input,
                  color: styles.input.color,
                  backgroundColor: styles.input.backgroundColor,
                }}
              >
                <SelectValue placeholder="Sélectionner un emplacement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fridge">
                  <div className="flex items-center gap-2">
                    <span>🥗</span>
                    <span>Frigo</span>
                  </div>
                </SelectItem>
                <SelectItem value="pantry">
                  <div className="flex items-center gap-2">
                    <span>📦</span>
                    <span>Placard</span>
                  </div>
                </SelectItem>
                <SelectItem value="freezer">
                  <div className="flex items-center gap-2">
                    <span>🧊</span>
                    <span>Congélateur</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label 
              htmlFor="expiryDate" 
              className="text-gray-700 dark:text-gray-300"
              style={styles.textSecondary}
            >
              Date de péremption (optionnel)
            </Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              style={{
                ...styles.input,
                color: styles.input.color,
                backgroundColor: styles.input.backgroundColor,
                colorScheme: 'dark',
              }}
              min={new Date().toISOString().split('T')[0]}
            />
            {expiryDate && (
              <p 
                className="text-xs text-gray-500 dark:text-gray-400"
                style={styles.textMuted}
              >
                Expire le {new Date(expiryDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
          </button>
        </form>
      </div>

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScanned}
      />
    </div>
  );
}