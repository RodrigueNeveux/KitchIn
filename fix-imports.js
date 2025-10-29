const fs = require('fs');
const path = require('path');

// Fonction pour corriger les imports dans un fichier
function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Liste des corrections à effectuer
  const fixes = [
    { from: /from ["']next-themes@[\d.]+["']/g, to: 'from "next-themes"' },
    { from: /from ["']sonner@[\d.]+["']/g, to: 'from "sonner"' },
    { from: /from ["']lucide-react@[\d.]+["']/g, to: 'from "lucide-react"' },
    { from: /from ["']@radix-ui\/react-switch@[\d.]+["']/g, to: 'from "@radix-ui/react-switch"' },
    { from: /from ["']@radix-ui\/react-checkbox@[\d.]+["']/g, to: 'from "@radix-ui/react-checkbox"' },
    { from: /from ["']@radix-ui\/react-label@[\d.]+["']/g, to: 'from "@radix-ui/react-label"' },
    { from: /from ["']@radix-ui\/react-dropdown-menu@[\d.]+["']/g, to: 'from "@radix-ui/react-dropdown-menu"' },
    { from: /from ["']@radix-ui\/react-select@[\d.]+["']/g, to: 'from "@radix-ui/react-select"' },
  ];

  // Appliquer toutes les corrections
  fixes.forEach(fix => {
    if (fix.from.test(content)) {
      content = content.replace(fix.from, fix.to);
      modified = true;
    }
  });

  // Sauvegarder si modifié
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigé: ${filePath}`);
    return true;
  }
  return false;
}

// Fonction pour parcourir récursivement les dossiers
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      fixedCount += walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixImportsInFile(filePath)) {
        fixedCount++;
      }
    }
  });

  return fixedCount;
}

// Exécution
console.log('🔧 Correction des imports en cours...\n');
const srcPath = path.join(__dirname, 'src');
const fixedCount = walkDir(srcPath);

console.log(`\n✨ Terminé! ${fixedCount} fichier(s) corrigé(s).`);
console.log('\n📝 Maintenant, exécutez: npm run dev');