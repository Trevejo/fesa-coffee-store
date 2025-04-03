import { Product } from '../database'; 

export const testProducts: Product[] = [
  {
    "id": 1,
    "category_id": 1,
    "name": "Espresso",
    "description": "Strong concentrated coffee served in small shots",
    "price": 3.99,
    "image_url": "https://img.freepik.com/free-photo/closeup-classic-fresh-espresso-served-dark-surface_1220-5376.jpg?t=st=1743639229~exp=1743642829~hmac=c04bb8cb9c155d26de7afda689d7c9bd53283fff236c3a5a06489b5f780e4886&w=740"
  },
  {
    "id": 2,
    "category_id": 1,
    "name": "Cappuccino",
    "description": "Espresso with steamed milk foam",
    "price": 4.99,
    "image_url": "https://ichef.bbc.co.uk/ace/standard/1600/food/recipes/the_perfect_mocha_coffee_29100_16x9.jpg.webp"
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
    "image_url": "https://gatherforbread.com/wp-content/uploads/2014/10/Dark-Chocolate-Mocha-Square.jpg"
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
    "image_url": "https://www.nescafe.com/br/sites/default/files/2023-08/RecipeHero_IcedCaramelLatte_1066x1066.jpg"
  },
  {
    "id": 7,
    "category_id": 2,
    "name": "Cold Brew",
    "description": "Slow-steeped coffee served cold and smooth",
    "price": 5.99,
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSow5TvR2THvfnjpgySH3yxE69iGpDAUQy14g&s"
  },
  {
    "id": 8,
    "category_id": 3,
    "name": "Pumpkin Spice Latte",
    "description": "Espresso with pumpkin spice, steamed milk, and whipped cream",
    "price": 6.49,
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLBto1w9ZpFTnb5sv2x1ldYZqt-8FDxVglmg&s"
  },
  {
    "id": 9,
    "category_id": 3,
    "name": "Peppermint Mocha",
    "description": "Chocolatey espresso with peppermint, steamed milk, and whipped cream",
    "price": 6.49,
    "image_url": "https://lifemadesweeter.com/wp-content/uploads/Peppermint-Latte-Photo-Recipe-Picture-3.jpg"
  },
  {
    "id": 10,
    "category_id": 3,
    "name": "Gingerbread Latte",
    "description": "Espresso with gingerbread syrup, steamed milk, and whipped cream",
    "price": 6.49,
    "image_url": "https://flouringkitchen.com/wp-content/uploads/2023/10/gingerbread_latte_thumbnail.jpg"
  }
];
