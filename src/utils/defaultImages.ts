// Collection of royalty-free coffee images to use as fallback
export const defaultCoffeeImages = [
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg', // Coffee cup on table
  'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg', // Coffee beans
  'https://images.pexels.com/photos/374757/pexels-photo-374757.jpeg', // Latte art
  'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg', // Espresso shot
  'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg', // Coffee shop
  'https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg', // Coffee and pastries
  'https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg', // Coffee beans in scoop
  'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg', // Coffee being poured
];

export const getRandomCoffeeImage = (): string => {
  const randomIndex = Math.floor(Math.random() * defaultCoffeeImages.length);
  return defaultCoffeeImages[randomIndex];
}; 