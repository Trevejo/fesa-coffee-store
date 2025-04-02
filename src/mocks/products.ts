import { Product } from '../database'; 

export const testProducts: Product[] = [
  {
    "id": 1,
    "category_id": 1,
    "name": "Espresso",
    "description": "Strong concentrated coffee served in small shots",
    "price": 3.99,
    "image_url": "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg"
  },
  {
    "id": 2,
    "category_id": 1,
    "name": "Cappuccino",
    "description": "Espresso with steamed milk foam",
    "price": 4.99,
    "image_url": "https://images.pexels.com/photos/533393/pexels-photo-533393.jpeg"
  },
  {
    "id": 3,
    "category_id": 1,
    "name": "Latte",
    "description": "Espresso with steamed milk and light foam",
    "price": 5.49,
    "image_url": "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg"
  },
  {
    "id": 4,
    "category_id": 1,
    "name": "Mocha",
    "description": "Espresso with chocolate, steamed milk, and whipped cream",
    "price": 5.99,
    "image_url": "https://images.pexels.com/photos/6331490/pexels-photo-6331490.jpeg"
  },
  {
    "id": 5,
    "category_id": 2,
    "name": "Iced Americano",
    "description": "Espresso diluted with cold water and ice",
    "price": 4.49,
    "image_url": "https://images.pexels.com/photos/9360311/pexels-photo-9360311.jpeg"
  },
  {
    "id": 6,
    "category_id": 2,
    "name": "Iced Latte",
    "description": "Chilled espresso with milk and ice",
    "price": 5.49,
    "image_url": "https://images.pexels.com/photos/3020917/pexels-photo-3020917.jpeg"
  },
  {
    "id": 7,
    "category_id": 2,
    "name": "Cold Brew",
    "description": "Slow-steeped coffee served cold and smooth",
    "price": 5.99,
    "image_url": require("../images/cold-brew.jpg")
  },
  {
    "id": 8,
    "category_id": 3,
    "name": "Pumpkin Spice Latte",
    "description": "Espresso with pumpkin spice, steamed milk, and whipped cream",
    "price": 6.49,
    "image_url": "https://images.pexels.com/photos/4110005/pexels-photo-4110005.jpeg"
  },
  {
    "id": 9,
    "category_id": 3,
    "name": "Peppermint Mocha",
    "description": "Chocolatey espresso with peppermint, steamed milk, and whipped cream",
    "price": 6.49,
    "image_url": "https://images.pexels.com/photos/302901/pexels-photo-302901.jpeg"
  },
  {
    "id": 10,
    "category_id": 3,
    "name": "Gingerbread Latte",
    "description": "Espresso with gingerbread syrup, steamed milk, and whipped cream",
    "price": 6.49,
    "image_url": "https://images.pexels.com/photos/731932/pexels-photo-731932.jpeg"
  }
];
