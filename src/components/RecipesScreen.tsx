import { Clock, Users, ChefHat, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useMemo } from 'react';

export interface Recipe {
  id: string;
  name: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  ingredients: { item: string; quantity: string }[];
  steps: string[];
  category: string;
}

interface Product {
  id: string;
  name: string;
  quantity: number;
  category: string;
}

interface RecipesScreenProps {
  onRecipeClick: (recipe: Recipe) => void;
  availableProducts?: Product[];
}

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Pâtes Carbonara',
    image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYXxlbnwxfHx8fDE3NjA4OTc2NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Facile',
    category: 'Plat principal',
    ingredients: [
      { item: 'Spaghetti', quantity: '400g' },
      { item: 'Lardons', quantity: '200g' },
      { item: 'Œufs', quantity: '4' },
      { item: 'Parmesan', quantity: '100g' },
      { item: 'Poivre', quantity: 'Au goût' },
      { item: 'Sel', quantity: 'Au goût' },
    ],
    steps: [
      'Faire cuire les pâtes dans une grande casserole d\'eau salée bouillante selon les instructions du paquet.',
      'Pendant ce temps, faire revenir les lardons dans une poêle sans matière grasse jusqu\'à ce qu\'ils soient croustillants.',
      'Dans un bol, battre les œufs avec le parmesan râpé et du poivre noir.',
      'Égoutter les pâtes en réservant une tasse d\'eau de cuisson.',
      'Mélanger immédiatement les pâtes chaudes avec les lardons hors du feu.',
      'Ajouter le mélange œufs-parmesan et mélanger rapidement. Ajouter un peu d\'eau de cuisson si nécessaire pour obtenir une sauce crémeuse.',
      'Servir immédiatement avec du parmesan supplémentaire.',
    ],
  },
  {
    id: '2',
    name: 'Poulet au Curry',
    image: 'https://images.unsplash.com/photo-1707448829764-9474458021ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwY3VycnklMjByaWNlfGVufDF8fHx8MTc2MDkyNTUzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    difficulty: 'Moyen',
    category: 'Plat principal',
    ingredients: [
      { item: 'Filets de poulet', quantity: '600g' },
      { item: 'Oignon', quantity: '2' },
      { item: 'Ail', quantity: '3 gousses' },
      { item: 'Curry en poudre', quantity: '2 c. à soupe' },
      { item: 'Lait de coco', quantity: '400ml' },
      { item: 'Tomates concassées', quantity: '400g' },
      { item: 'Huile d\'olive', quantity: '2 c. à soupe' },
      { item: 'Riz basmati', quantity: '300g' },
      { item: 'Sel et poivre', quantity: 'Au goût' },
    ],
    steps: [
      'Couper le poulet en morceaux et l\'assaisonner avec du sel et du poivre.',
      'Hacher finement les oignons et l\'ail.',
      'Faire chauffer l\'huile dans une grande poêle et faire dorer le poulet. Réserver.',
      'Dans la même poêle, faire revenir les oignons jusqu\'à ce qu\'ils soient translucides.',
      'Ajouter l\'ail et le curry, faire revenir 1 minute.',
      'Ajouter les tomates concassées et le lait de coco. Mélanger.',
      'Remettre le poulet dans la sauce et laisser mijoter 20-25 minutes.',
      'Pendant ce temps, cuire le riz selon les instructions du paquet.',
      'Servir le poulet au curry sur un lit de riz basmati.',
    ],
  },
  {
    id: '3',
    name: 'Gâteau au Chocolat',
    image: 'https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlJTIwZGVzc2VydHxlbnwxfHx8fDE3NjA4ODAwNzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 20,
    cookTime: 35,
    servings: 8,
    difficulty: 'Facile',
    category: 'Dessert',
    ingredients: [
      { item: 'Chocolat noir', quantity: '200g' },
      { item: 'Beurre', quantity: '150g' },
      { item: 'Sucre', quantity: '150g' },
      { item: 'Œufs', quantity: '4' },
      { item: 'Farine', quantity: '100g' },
      { item: 'Levure chimique', quantity: '1 sachet' },
      { item: 'Sel', quantity: '1 pincée' },
    ],
    steps: [
      'Préchauffer le four à 180°C (th.6).',
      'Faire fondre le chocolat et le beurre au bain-marie ou au micro-ondes.',
      'Dans un saladier, battre les œufs avec le sucre jusqu\'à ce que le mélange blanchisse.',
      'Ajouter le chocolat fondu et mélanger.',
      'Incorporer la farine tamisée avec la levure et le sel.',
      'Verser la pâte dans un moule beurré et fariné.',
      'Enfourner pour 30-35 minutes. Le gâteau doit rester légèrement coulant au centre.',
      'Laisser refroidir avant de démouler.',
      'Servir avec de la crème anglaise ou une boule de glace vanille.',
    ],
  },
  {
    id: '4',
    name: 'Spaghetti Bolognaise',
    image: 'https://images.unsplash.com/photo-1572441713132-c542fc4fe282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFnaGV0dGklMjBib2xvZ25haXNlfGVufDF8fHx8MTc2MDkyNTUzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 15,
    cookTime: 40,
    servings: 4,
    difficulty: 'Facile',
    category: 'Plat principal',
    ingredients: [
      { item: 'Spaghetti', quantity: '400g' },
      { item: 'Viande hachée', quantity: '500g' },
      { item: 'Sauce tomate', quantity: '400g' },
      { item: 'Oignon', quantity: '1' },
      { item: 'Ail', quantity: '2 gousses' },
      { item: 'Huile d\'olive', quantity: '2 c. à soupe' },
      { item: 'Sel', quantity: 'Au goût' },
      { item: 'Poivre', quantity: 'Au goût' },
    ],
    steps: [
      'Hacher finement l\'oignon et l\'ail.',
      'Faire chauffer l\'huile dans une grande poêle et faire revenir l\'oignon.',
      'Ajouter la viande hachée et faire dorer en remuant.',
      'Ajouter l\'ail et faire revenir 1 minute.',
      'Verser la sauce tomate, saler, poivrer et laisser mijoter 30 minutes à feu doux.',
      'Pendant ce temps, cuire les spaghetti selon les instructions du paquet.',
      'Égoutter les pâtes et servir avec la sauce bolognaise.',
      'Saupoudrer de parmesan si désiré.',
    ],
  },
  {
    id: '5',
    name: 'Omelette aux Fromages',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbWVsZXR0ZXxlbnwxfHx8fDE3NjA5MjU1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'Facile',
    category: 'Plat principal',
    ingredients: [
      { item: 'Œufs', quantity: '4' },
      { item: 'Fromage', quantity: '100g' },
      { item: 'Beurre', quantity: '20g' },
      { item: 'Sel', quantity: 'Au goût' },
      { item: 'Poivre', quantity: 'Au goût' },
    ],
    steps: [
      'Battre les œufs dans un bol avec du sel et du poivre.',
      'Râper le fromage.',
      'Faire fondre le beurre dans une poêle à feu moyen.',
      'Verser les œufs battus dans la poêle.',
      'Quand les œufs commencent à prendre, ajouter le fromage râpé.',
      'Plier l\'omelette en deux et servir immédiatement.',
    ],
  },
  {
    id: '6',
    name: 'Salade de Tomates Mozzarella',
    image: 'https://images.unsplash.com/photo-1592417817038-d13fd7ab2a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBtb3p6YXJlbGxhJTIwc2FsYWR8ZW58MXx8fHwxNzYwOTI1NTMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 10,
    cookTime: 0,
    servings: 4,
    difficulty: 'Facile',
    category: 'Entrée',
    ingredients: [
      { item: 'Tomates', quantity: '4' },
      { item: 'Mozzarella', quantity: '250g' },
      { item: 'Basilic', quantity: '1 bouquet' },
      { item: 'Huile d\'olive', quantity: '3 c. à soupe' },
      { item: 'Sel', quantity: 'Au goût' },
      { item: 'Poivre', quantity: 'Au goût' },
    ],
    steps: [
      'Laver et couper les tomates en rondelles.',
      'Égoutter et couper la mozzarella en rondelles.',
      'Disposer en alternant tomates et mozzarella sur un plat.',
      'Parsemer de feuilles de basilic frais.',
      'Arroser d\'huile d\'olive.',
      'Assaisonner de sel et poivre.',
      'Servir frais.',
    ],
  },
  {
    id: '7',
    name: 'Riz Sauté aux Légumes',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2UlMjB2ZWdldGFibGVzfGVufDF8fHx8MTc2MDkyNTUzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'Facile',
    category: 'Plat principal',
    ingredients: [
      { item: 'Riz', quantity: '300g' },
      { item: 'Carottes', quantity: '2' },
      { item: 'Poivron', quantity: '1' },
      { item: 'Oignon', quantity: '1' },
      { item: 'Œufs', quantity: '2' },
      { item: 'Sauce soja', quantity: '3 c. à soupe' },
      { item: 'Huile', quantity: '2 c. à soupe' },
    ],
    steps: [
      'Cuire le riz et le laisser refroidir (idéalement utiliser du riz de la veille).',
      'Couper les légumes en petits dés.',
      'Battre les œufs et faire une omelette, la découper en morceaux.',
      'Faire chauffer l\'huile dans un wok ou une grande poêle.',
      'Faire sauter les légumes 5 minutes.',
      'Ajouter le riz et faire sauter 5 minutes.',
      'Ajouter les œufs et la sauce soja, mélanger.',
      'Servir chaud.',
    ],
  },
  {
    id: '8',
    name: 'Poulet Rôti aux Herbes',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdCUyMGNoaWNrZW58ZW58MXx8fHwxNzYwOTI1NTMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 15,
    cookTime: 60,
    servings: 4,
    difficulty: 'Moyen',
    category: 'Plat principal',
    ingredients: [
      { item: 'Poulet entier', quantity: '1,5kg' },
      { item: 'Beurre', quantity: '50g' },
      { item: 'Thym', quantity: '3 branches' },
      { item: 'Romarin', quantity: '2 branches' },
      { item: 'Citron', quantity: '1' },
      { item: 'Ail', quantity: '4 gousses' },
      { item: 'Sel', quantity: 'Au goût' },
      { item: 'Poivre', quantity: 'Au goût' },
    ],
    steps: [
      'Préchauffer le four à 200°C.',
      'Rincer le poulet et le sécher avec du papier absorbant.',
      'Mélanger le beurre avec le thym et le romarin hachés.',
      'Glisser le beurre aux herbes sous la peau du poulet.',
      'Mettre le citron coupé en deux et l\'ail dans la cavité.',
      'Badigeonner le poulet d\'huile, saler et poivrer.',
      'Enfourner pour 1h, en arrosant régulièrement.',
      'Laisser reposer 10 minutes avant de découper.',
    ],
  },
  {
    id: '9',
    name: 'Quiche Lorraine',
    image: 'https://images.unsplash.com/photo-1601001815894-4bb6c81416d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWljaGUlMjBsb3JyYWluZXxlbnwxfHx8fDE3NjA5MjU1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    difficulty: 'Facile',
    category: 'Plat principal',
    ingredients: [
      { item: 'Pâte brisée', quantity: '1' },
      { item: 'Lardons', quantity: '200g' },
      { item: 'Œufs', quantity: '3' },
      { item: 'Crème fraîche', quantity: '200ml' },
      { item: 'Lait', quantity: '100ml' },
      { item: 'Fromage râpé', quantity: '100g' },
      { item: 'Sel', quantity: 'Au goût' },
      { item: 'Poivre', quantity: 'Au goût' },
      { item: 'Muscade', quantity: '1 pincée' },
    ],
    steps: [
      'Préchauffer le four à 180°C.',
      'Étaler la pâte dans un moule à tarte et piquer avec une fourchette.',
      'Faire revenir les lardons dans une poêle sans matière grasse.',
      'Battre les œufs avec la crème, le lait, le sel, le poivre et la muscade.',
      'Répartir les lardons sur la pâte.',
      'Verser le mélange œufs-crème et parsemer de fromage.',
      'Enfourner 35-40 minutes jusqu\'à ce que la quiche soit dorée.',
      'Laisser tiédir avant de servir.',
    ],
  },
  {
    id: '10',
    name: 'Lasagnes à la Bolognaise',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXNhZ25hfGVufDF8fHx8MTc2MDkyNTUzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 30,
    cookTime: 50,
    servings: 6,
    difficulty: 'Moyen',
    category: 'Plat principal',
    ingredients: [
      { item: 'Plaques de lasagnes', quantity: '12' },
      { item: 'Viande hachée', quantity: '600g' },
      { item: 'Sauce tomate', quantity: '500g' },
      { item: 'Oignon', quantity: '2' },
      { item: 'Béchamel', quantity: '500ml' },
      { item: 'Fromage râpé', quantity: '200g' },
      { item: 'Ail', quantity: '2 gousses' },
      { item: 'Huile d\'olive', quantity: '2 c. à soupe' },
    ],
    steps: [
      'Faire revenir l\'oignon et l\'ail hachés dans l\'huile.',
      'Ajouter la viande hachée et faire dorer.',
      'Incorporer la sauce tomate et laisser mijoter 20 minutes.',
      'Préchauffer le four à 180°C.',
      'Dans un plat, alterner couches de pâtes, sauce bolognaise et béchamel.',
      'Terminer par une couche de béchamel et parsemer de fromage.',
      'Enfourner 40-50 minutes jusqu\'à ce que le dessus soit doré.',
      'Laisser reposer 10 minutes avant de servir.',
    ],
  },
  {
    id: '11',
    name: 'Soupe de Légumes',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBzb3VwfGVufDF8fHx8MTc2MDkyNTUzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'Facile',
    category: 'Entrée',
    ingredients: [
      { item: 'Carottes', quantity: '3' },
      { item: 'Poireaux', quantity: '2' },
      { item: 'Pommes de terre', quantity: '3' },
      { item: 'Courgettes', quantity: '2' },
      { item: 'Oignon', quantity: '1' },
      { item: 'Bouillon de légumes', quantity: '1,5L' },
      { item: 'Huile d\'olive', quantity: '2 c. à soupe' },
      { item: 'Sel', quantity: 'Au goût' },
      { item: 'Poivre', quantity: 'Au goût' },
    ],
    steps: [
      'Éplucher et couper tous les légumes en morceaux.',
      'Faire revenir l\'oignon dans l\'huile d\'olive.',
      'Ajouter les carottes et les pommes de terre, faire revenir 5 minutes.',
      'Ajouter les poireaux et les courgettes.',
      'Verser le bouillon et porter à ébullition.',
      'Laisser mijoter 25-30 minutes jusqu\'à ce que les légumes soient tendres.',
      'Mixer selon vos préférences (lisse ou avec morceaux).',
      'Ajuster l\'assaisonnement et servir chaud.',
    ],
  },
  {
    id: '12',
    name: 'Gratin Dauphinois',
    image: 'https://images.unsplash.com/photo-1589227365533-cee3a4b3c966?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3RhdG8lMjBncmF0aW58ZW58MXx8fHwxNzYwOTI1NTMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 20,
    cookTime: 60,
    servings: 6,
    difficulty: 'Facile',
    category: 'Accompagnement',
    ingredients: [
      { item: 'Pommes de terre', quantity: '1kg' },
      { item: 'Crème fraîche', quantity: '300ml' },
      { item: 'Lait', quantity: '200ml' },
      { item: 'Ail', quantity: '2 gousses' },
      { item: 'Fromage râpé', quantity: '100g' },
      { item: 'Beurre', quantity: '30g' },
      { item: 'Sel', quantity: 'Au goût' },
      { item: 'Poivre', quantity: 'Au goût' },
      { item: 'Muscade', quantity: '1 pincée' },
    ],
    steps: [
      'Préchauffer le four à 160°C.',
      'Éplucher et couper les pommes de terre en fines rondelles.',
      'Frotter un plat à gratin avec l\'ail et le beurrer.',
      'Mélanger la crème, le lait, le sel, le poivre et la muscade.',
      'Disposer les pommes de terre en couches dans le plat.',
      'Verser le mélange crème-lait sur les pommes de terre.',
      'Parsemer de fromage râpé.',
      'Enfourner 1h jusqu\'à ce que le dessus soit doré et les pommes de terre tendres.',
    ],
  },
  {
    id: '13',
    name: 'Crêpes Sucrées',
    image: 'https://images.unsplash.com/photo-1519676867240-f9f3ded66e8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVwZXMlMjBzdWdhcnxlbnwxfHx8fDE3NjA5MjU1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Facile',
    category: 'Dessert',
    ingredients: [
      { item: 'Farine', quantity: '250g' },
      { item: 'Œufs', quantity: '3' },
      { item: 'Lait', quantity: '500ml' },
      { item: 'Sucre', quantity: '2 c. à soupe' },
      { item: 'Beurre fondu', quantity: '30g' },
      { item: 'Sel', quantity: '1 pincée' },
      { item: 'Huile', quantity: 'Pour la cuisson' },
    ],
    steps: [
      'Mettre la farine dans un saladier avec le sel et le sucre.',
      'Faire un puits et ajouter les œufs.',
      'Mélanger en incorporant progressivement le lait.',
      'Ajouter le beurre fondu et bien mélanger.',
      'Laisser reposer 30 minutes.',
      'Faire chauffer une poêle huilée.',
      'Verser une louche de pâte et étaler finement.',
      'Cuire 1-2 minutes de chaque côté jusqu\'à ce que la crêpe soit dorée.',
    ],
  },
  {
    id: '14',
    name: 'Salade César',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZHxlbnwxfHx8fDE3NjA5MjU1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: 'Facile',
    category: 'Entrée',
    ingredients: [
      { item: 'Laitue romaine', quantity: '2' },
      { item: 'Poulet', quantity: '300g' },
      { item: 'Parmesan', quantity: '50g' },
      { item: 'Croûtons', quantity: '100g' },
      { item: 'Mayonnaise', quantity: '3 c. à soupe' },
      { item: 'Citron', quantity: '1' },
      { item: 'Ail', quantity: '1 gousse' },
      { item: 'Anchois', quantity: '3 filets' },
    ],
    steps: [
      'Faire cuire le poulet et le couper en morceaux.',
      'Laver et essorer la salade.',
      'Préparer la sauce : mixer mayonnaise, citron, ail, anchois.',
      'Couper la salade en morceaux.',
      'Dans un grand saladier, mélanger la salade avec la sauce.',
      'Ajouter le poulet et les croûtons.',
      'Parsemer de copeaux de parmesan.',
      'Servir immédiatement.',
    ],
  },
  {
    id: '15',
    name: 'Tarte aux Pommes',
    image: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMHRhcnR8ZW58MXx8fHwxNzYwOTI1NTMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 20,
    cookTime: 35,
    servings: 8,
    difficulty: 'Facile',
    category: 'Dessert',
    ingredients: [
      { item: 'Pâte brisée', quantity: '1' },
      { item: 'Pommes', quantity: '6' },
      { item: 'Sucre', quantity: '80g' },
      { item: 'Beurre', quantity: '40g' },
      { item: 'Cannelle', quantity: '1 c. à café' },
      { item: 'Confiture d\'abricot', quantity: '2 c. à soupe' },
    ],
    steps: [
      'Préchauffer le four à 180°C.',
      'Étaler la pâte dans un moule à tarte.',
      'Éplucher et couper les pommes en fines lamelles.',
      'Disposer les pommes en rosace sur la pâte.',
      'Saupoudrer de sucre et de cannelle.',
      'Parsemer de noisettes de beurre.',
      'Enfourner 30-35 minutes jusqu\'à ce que les pommes soient dorées.',
      'Badigeonner de confiture d\'abricot tiède en sortant du four.',
    ],
  },
  {
    id: '16',
    name: 'Pizza Margherita',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGF8ZW58MXx8fHwxNzYwOTI1NTMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'Moyen',
    category: 'Plat principal',
    ingredients: [
      { item: 'Pâte à pizza', quantity: '1' },
      { item: 'Sauce tomate', quantity: '200g' },
      { item: 'Mozzarella', quantity: '200g' },
      { item: 'Basilic frais', quantity: '1 bouquet' },
      { item: 'Huile d\'olive', quantity: '2 c. à soupe' },
      { item: 'Sel', quantity: 'Au goût' },
      { item: 'Origan', quantity: '1 c. à café' },
    ],
    steps: [
      'Préchauffer le four à 250°C (le plus chaud possible).',
      'Étaler la pâte à pizza sur une plaque huilée.',
      'Étaler la sauce tomate sur toute la surface.',
      'Égoutter et couper la mozzarella en tranches.',
      'Disposer la mozzarella sur la pizza.',
      'Saupoudrer d\'origan, saler et arroser d\'huile d\'olive.',
      'Enfourner 12-15 minutes jusqu\'à ce que les bords soient dorés.',
      'Parsemer de basilic frais en sortant du four.',
    ],
  },
  {
    id: '17',
    name: 'Ratatouille',
    image: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXRhdG91aWxsZXxlbnwxfHx8fDE3NjA5MjU1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 25,
    cookTime: 45,
    servings: 6,
    difficulty: 'Facile',
    category: 'Plat principal',
    ingredients: [
      { item: 'Aubergines', quantity: '2' },
      { item: 'Courgettes', quantity: '2' },
      { item: 'Poivrons', quantity: '2' },
      { item: 'Tomates', quantity: '4' },
      { item: 'Oignon', quantity: '2' },
      { item: 'Ail', quantity: '3 gousses' },
      { item: 'Huile d\'olive', quantity: '4 c. à soupe' },
      { item: 'Herbes de Provence', quantity: '2 c. à café' },
    ],
    steps: [
      'Couper tous les légumes en dés réguliers.',
      'Faire revenir l\'oignon dans l\'huile d\'olive.',
      'Ajouter l\'ail et les poivrons, cuire 5 minutes.',
      'Incorporer les aubergines et les courgettes.',
      'Ajouter les tomates et les herbes de Provence.',
      'Saler, poivrer et laisser mijoter 40 minutes à feu doux.',
      'Remuer de temps en temps.',
      'Servir chaud ou froid.',
    ],
  },
  {
    id: '18',
    name: 'Mousse au Chocolat',
    image: 'https://images.unsplash.com/photo-1541599468348-e96984315921?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBtb3Vzc2V8ZW58MXx8fHwxNzYwOTI1NTMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 15,
    cookTime: 5,
    servings: 6,
    difficulty: 'Moyen',
    category: 'Dessert',
    ingredients: [
      { item: 'Chocolat noir', quantity: '200g' },
      { item: 'Œufs', quantity: '6' },
      { item: 'Sucre', quantity: '50g' },
      { item: 'Sel', quantity: '1 pincée' },
    ],
    steps: [
      'Faire fondre le chocolat au bain-marie.',
      'Séparer les blancs des jaunes d\'œufs.',
      'Incorporer les jaunes un par un dans le chocolat fondu tiède.',
      'Monter les blancs en neige avec le sel.',
      'Ajouter le sucre en continuant de battre.',
      'Incorporer délicatement les blancs au mélange chocolat.',
      'Répartir dans des verrines.',
      'Réfrigérer au moins 3 heures avant de servir.',
    ],
  },
  {
    id: '19',
    name: 'Steak Frites',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVhayUyMGZyaWVzfGVufDF8fHx8MTc2MDkyNTUzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Facile',
    category: 'Plat principal',
    ingredients: [
      { item: 'Steaks de bœuf', quantity: '4' },
      { item: 'Pommes de terre', quantity: '1kg' },
      { item: 'Huile', quantity: 'Pour friture' },
      { item: 'Beurre', quantity: '30g' },
      { item: 'Sel', quantity: 'Au goût' },
      { item: 'Poivre', quantity: 'Au goût' },
    ],
    steps: [
      'Éplucher et couper les pommes de terre en frites.',
      'Laver et sécher les frites.',
      'Faire chauffer l\'huile à 160°C et cuire les frites 7 minutes.',
      'Les égoutter et laisser reposer.',
      'Sortir les steaks du frigo 30 minutes avant cuisson.',
      'Monter l\'huile à 180°C et faire dorer les frites 3-4 minutes.',
      'Saler, poivrer les steaks et les cuire dans du beurre chaud.',
      'Servir les steaks avec les frites bien chaudes.',
    ],
  },
  {
    id: '20',
    name: 'Tiramisu',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aXJhbWlzdXxlbnwxfHx8fDE3NjA5MjU1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 30,
    cookTime: 0,
    servings: 8,
    difficulty: 'Moyen',
    category: 'Dessert',
    ingredients: [
      { item: 'Mascarpone', quantity: '500g' },
      { item: 'Œufs', quantity: '6' },
      { item: 'Sucre', quantity: '100g' },
      { item: 'Biscuits à la cuillère', quantity: '300g' },
      { item: 'Café fort', quantity: '300ml' },
      { item: 'Cacao en poudre', quantity: '2 c. à soupe' },
      { item: 'Amaretto', quantity: '3 c. à soupe' },
    ],
    steps: [
      'Préparer un café fort et le laisser refroidir. Ajouter l\'amaretto.',
      'Séparer les blancs des jaunes d\'œufs.',
      'Battre les jaunes avec le sucre jusqu\'à ce que le mélange blanchisse.',
      'Incorporer le mascarpone au mélange jaunes-sucre.',
      'Monter les blancs en neige ferme et les incorporer délicatement.',
      'Tremper rapidement les biscuits dans le café.',
      'Alterner couches de biscuits et de crème dans un plat.',
      'Saupoudrer de cacao et réfrigérer au moins 6 heures.',
    ],
  },
];

export function RecipesScreen({ onRecipeClick, availableProducts = [] }: RecipesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyPossible, setShowOnlyPossible] = useState(false);

  // Normalize product names for matching
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/s$/, '') // Remove plural 's'
      .trim();
  };

  // Calculate match percentage for each recipe
  const recipesWithMatch = useMemo(() => {
    return SAMPLE_RECIPES.map((recipe) => {
      const ingredientNames = recipe.ingredients.map((ing) => normalizeText(ing.item));
      const availableNames = availableProducts.map((prod) => normalizeText(prod.name));
      
      // Ignore common ingredients like salt, pepper, oil in the count
      const commonIngredients = ['sel', 'poivre', 'huile', 'eau', 'beurre'];
      const essentialIngredients = ingredientNames.filter(
        (ing) => !commonIngredients.some((common) => ing.includes(common))
      );
      
      // Count how many ESSENTIAL ingredients are available
      const matchedEssentialIngredients = essentialIngredients.filter((ingredient) => {
        return availableNames.some((available) => {
          // Check if ingredient contains product name or vice versa
          return (
            ingredient.includes(available) ||
            available.includes(ingredient) ||
            // Special cases
            (ingredient.includes('pate') && available.includes('spaghetti')) ||
            (ingredient.includes('spaghetti') && available.includes('pate')) ||
            (ingredient.includes('viande') && available.includes('boeuf')) ||
            (ingredient.includes('viande') && available.includes('poulet'))
          );
        });
      });
      
      const matchPercentage = essentialIngredients.length > 0
        ? Math.round((matchedEssentialIngredients.length / essentialIngredients.length) * 100)
        : 0;

      return {
        ...recipe,
        matchPercentage,
        matchedCount: matchedEssentialIngredients.length,
        totalEssential: essentialIngredients.length,
        canMake: matchPercentage >= 70,
      };
    });
  }, [availableProducts]);

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    let recipes = recipesWithMatch.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (showOnlyPossible) {
      recipes = recipes.filter((recipe) => recipe.canMake);
    }

    // Sort by match percentage (highest first)
    return recipes.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [recipesWithMatch, searchQuery, showOnlyPossible]);

  const getDifficultyColor = (difficulty: Recipe['difficulty']) => {
    switch (difficulty) {
      case 'Facile':
        return 'text-green-600 bg-green-50';
      case 'Moyen':
        return 'text-orange-600 bg-orange-50';
      case 'Difficile':
        return 'text-red-600 bg-red-50';
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-6 py-4 shadow-sm flex-shrink-0">
        <div className="max-w-md mx-auto">
          <h1 className="text-gray-800 mb-4">Recettes</h1>
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Rechercher une recette..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder:text-gray-400"
              style={{ WebkitTextFillColor: '#111827', color: '#111827' }}
            />
            <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          {/* Filter Toggle */}
          {availableProducts.length > 0 && (
            <button
              onClick={() => setShowOnlyPossible(!showOnlyPossible)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                showOnlyPossible
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={
                showOnlyPossible
                  ? { color: '#ffffff', WebkitTextFillColor: '#ffffff' }
                  : { color: '#374151', WebkitTextFillColor: '#374151' }
              }
            >
              <CheckCircle2 className="w-4 h-4" />
              Réalisables avec mon inventaire
            </button>
          )}
        </div>
      </header>

      {/* Recipes List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-32">
        <div className="max-w-md mx-auto space-y-4">
          {filteredRecipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => onRecipeClick(recipe)}
              className="w-full bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <ImageWithFallback
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getDifficultyColor(
                      recipe.difficulty
                    )}`}
                  >
                    {recipe.difficulty}
                  </span>
                  
                  {availableProducts.length > 0 && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${getMatchColor(
                        recipe.matchPercentage
                      )}`}
                    >
                      {recipe.matchPercentage}%
                    </span>
                  )}
                </div>
                
                {recipe.canMake && availableProducts.length > 0 && (
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>
                      <CheckCircle2 className="w-3 h-3" />
                      Réalisable
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 mb-2 text-left" style={{ color: '#111827', WebkitTextFillColor: '#111827' }}>
                  {recipe.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span style={{ color: '#4b5563', WebkitTextFillColor: '#4b5563' }}>
                      {recipe.prepTime + recipe.cookTime} min
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span style={{ color: '#4b5563', WebkitTextFillColor: '#4b5563' }}>
                      {recipe.servings} pers.
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="w-4 h-4" />
                    <span style={{ color: '#4b5563', WebkitTextFillColor: '#4b5563' }}>
                      {recipe.category}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune recette trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
