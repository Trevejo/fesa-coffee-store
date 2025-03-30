import { getDBConnection } from './database';

export interface Product {
  id?: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  available?: boolean;
}

// Test data for development
const testProducts: Product[] = [
  {
    category_id: 1,
    name: 'Espresso',
    description: 'Strong concentrated coffee served in small shots',
    price: 3.99,
    image_url: 'https://example.com/espresso.jpg',
    available: true
  },
  {
    category_id: 1,
    name: 'Cappuccino',
    description: 'Espresso with steamed milk foam',
    price: 4.99,
    image_url: 'https://example.com/cappuccino.jpg',
    available: true
  },
  {
    category_id: 2,
    name: 'Iced Americano',
    description: 'Espresso diluted with cold water and ice',
    price: 4.49,
    image_url: 'https://example.com/iced-americano.jpg',
    available: true
  }
];

export const productRepository = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    const db = await getDBConnection();
    const result = await db.getAllAsync<Product>('SELECT * FROM products ORDER BY name');
    console.log('All products:', result);
    return result;
  },

  // Get product by id
  getById: async (id: number): Promise<Product | null> => {
    const db = await getDBConnection();
    const result = await db.getFirstAsync<Product>('SELECT * FROM products WHERE id = ?', [id]);
    console.log('Product by id:', result);
    return result;
  },

  // Get products by category
  getByCategory: async (categoryId: number): Promise<Product[]> => {
    const db = await getDBConnection();
    const result = await db.getAllAsync<Product>(
      'SELECT * FROM products WHERE category_id = ? ORDER BY name',
      [categoryId]
    );
    console.log('Products by category:', result);
    return result;
  },

  // Create a new product
  create: async (product: Product): Promise<number> => {
    const db = await getDBConnection();
    const result = await db.runAsync(
      `INSERT INTO products (
        category_id, name, description, price, image_url, available
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        product.category_id,
        product.name,
        product.description || '',
        product.price,
        product.image_url || '',
        product.available === false ? 0 : 1
      ]
    );
    console.log('Created product:', result);
    return result.lastInsertRowId;
  },

  // Update an existing product
  update: async (product: Product): Promise<boolean> => {
    if (!product.id) {
      throw new Error('Product ID is required for updates');
    }

    const db = await getDBConnection();
    const result = await db.runAsync(
      `UPDATE products SET 
        category_id = ?, 
        name = ?, 
        description = ?, 
        price = ?, 
        image_url = ?, 
        available = ? 
       WHERE id = ?`,
      [
        product.category_id,
        product.name,
        product.description || '',
        product.price,
        product.image_url || '',
        product.available === false ? 0 : 1,
        product.id
      ]
    );
    console.log('Updated product:', result);
    return result.changes > 0;
  },

  // Delete a product
  delete: async (id: number): Promise<boolean> => {
    const db = await getDBConnection();
    const result = await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
    console.log('Deleted product:', result);
    return result.changes > 0;
  },

  // Initialize test data
  initializeTestData: async (): Promise<void> => {
    const db = await getDBConnection();
    
    // Check if we already have products
    const existingProducts = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM products'
    );

    console.log('Existing products: ', existingProducts);
    
    if (existingProducts.count === 0) {
      console.log('Initializing test products...');
      for (const product of testProducts) {
        await db.runAsync(
          `INSERT INTO products (
            category_id, name, description, price, image_url, available
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            product.category_id,
            product.name,
            product.description,
            product.price,
            product.image_url,
            product.available ? 1 : 0
          ]
        );
      }
      console.log('Test products initialized successfully');
    } else {
      console.log('Products already exist, skipping test data initialization');
    }
  }
}; 