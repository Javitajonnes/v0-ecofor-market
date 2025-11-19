import { Product } from './types'

export const products: Product[] = [
  {
    id: '1',
    name: 'Papel Higiénico Ecológico Doble Hoja 40m, 12 Un',
    brand: 'EcoComfort',
    description: 'Papel higiénico suave y resistente, 100% reciclado',
    image: '/eco-friendly-toilet-paper-roll-package-white-green.jpg',
    retailPrice: 8990,
    wholesalePrice: 7490,
    minWholesaleQty: 6,
    stock: 150,
    category: 'Papel',
    unit: '12 Un',
    featured: true,
    discount: 15
  },
  {
    id: '2',
    name: 'Servilletas Biodegradables 45m, 4 Rollos',
    brand: 'GreenElite',
    description: 'Servilletas ultra suaves biodegradables',
    image: '/eco-paper-towel-rolls-green-packaging.jpg',
    retailPrice: 5290,
    wholesalePrice: 4490,
    minWholesaleQty: 8,
    stock: 200,
    category: 'Papel',
    unit: '4 Un',
    discount: 10
  },
  {
    id: '3',
    name: 'Papel Higiénico Premium Doble Hoja 27m, 18 Un',
    brand: 'EcoComfort',
    description: 'Máxima suavidad y resistencia',
    image: '/premium-eco-toilet-paper-bulk-pack.jpg',
    retailPrice: 12450,
    wholesalePrice: 10290,
    minWholesaleQty: 4,
    stock: 80,
    category: 'Papel',
    unit: '18 Un'
  },
  {
    id: '4',
    name: 'Papel Higiénico Doble Hoja 20m, 4 Un',
    brand: 'EcoComfort',
    description: 'Opción económica y ecológica',
    image: '/eco-toilet-paper-small-pack-4-rolls.jpg',
    retailPrice: 3590,
    wholesalePrice: 2990,
    minWholesaleQty: 12,
    stock: 300,
    category: 'Papel',
    unit: '4 Un',
    discount: 20
  },
  {
    id: '5',
    name: 'Toallas de Papel Mega Doble Hoja 50m, 12 Un',
    brand: 'EcoComfort',
    description: 'Mayor absorción, 100% reciclado',
    image: '/eco-paper-towel-mega-pack-white.jpg',
    retailPrice: 14750,
    wholesalePrice: 12490,
    minWholesaleQty: 3,
    stock: 120,
    category: 'Toallas',
    unit: '12 Un'
  },
  {
    id: '6',
    name: 'Pañuelos Faciales Ultra Suave 50m, 12 Un',
    brand: 'GreenElite',
    description: 'Suavidad superior para tu piel',
    image: '/eco-facial-tissue-box-green-blue.jpg',
    retailPrice: 9490,
    wholesalePrice: 7990,
    minWholesaleQty: 6,
    stock: 180,
    category: 'Papel',
    unit: '12 Un'
  },
  {
    id: '7',
    name: 'Papel Higiénico Soft Care Doble Hoja 50m, 12 Un',
    brand: 'EcoSoft',
    description: 'Tecnología de máxima suavidad',
    image: '/soft-eco-toilet-paper-premium-white-pack.jpg',
    retailPrice: 16990,
    wholesalePrice: 14490,
    minWholesaleQty: 4,
    stock: 95,
    category: 'Papel',
    unit: '12 Un',
    featured: true
  },
  {
    id: '8',
    name: 'Servilletas de Mesa Biodegradables 100 Un',
    brand: 'GreenElite',
    description: 'Perfectas para eventos y restaurantes',
    image: '/biodegradable-napkins-stack-white-green.jpg',
    retailPrice: 2990,
    wholesalePrice: 2290,
    minWholesaleQty: 20,
    stock: 400,
    category: 'Servilletas',
    unit: '100 Un'
  }
]

export const categories = [
  'Todos',
  'Papel',
  'Toallas',
  'Servilletas',
  'Pañuelos'
]

export const brands = [
  'Todas',
  'EcoComfort',
  'GreenElite',
  'EcoSoft'
]
