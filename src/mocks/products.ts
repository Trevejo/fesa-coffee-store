import { Product } from '../database'; 

export const testProducts: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: 'Espresso',
    description: 'Strong concentrated coffee served in small shots',
    price: 3.99,
    image_url: 'https://example.com/espresso.jpg',
  },
  {
    id: 2,
    category_id: 1,
    name: 'Cappuccino',
    description: 'Espresso with steamed milk foam',
    price: 4.99,
    image_url: 'https://example.com/cappuccino.jpg',
  },
  {
    id: 3,
    category_id: 2,
    name: 'Iced Americano',
    description: 'Espresso diluted with cold water and ice',
    price: 4.49,
    image_url: 'https://example.com/iced-americano.jpg',
  }
];
