import { getDBConnection } from './database';

export interface Product {
  id?: number;
  category_id?: number;
  category_name?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
}

export const productRepository = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    const db = await getDBConnection();
    //const result = await db.getAllAsync('SELECT * FROM products ORDER BY name');
    const result = await db.getAllAsync(
      `SELECT products.*, categories.name as category_name 
       FROM products 
       LEFT JOIN categories ON products.category_id = categories.id`
    );
    await db.closeAsync();
    return result as Product[];
  },

  // Get product by id
  getById: async (id: number): Promise<Product | null> => {
    const db = await getDBConnection();
    const product = await db.getFirstAsync<Product>('SELECT * FROM products WHERE id = ?', [id]);

    return product || null;
},

  // Get products by category
  getByCategory: async (categoryId: number): Promise<Product[]> => {
    const db = await getDBConnection();
    const result = await db.execAsync(
      'SELECT * FROM products WHERE category_id = ? ORDER BY name',
      [categoryId]
    );
    return result.rows._array as Product[];
  },

  // Create a new product
  create: async (product: Product): Promise<number> => {
    const db = await getDBConnection();
    const result = await db.runAsync(
      `INSERT INTO products (
        category_id, name, description, price, image_url
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        product.category_id,
        product.name,
        product.description || '',
        product.price,
        product.image_url || '',
      ]
    );
    await db.closeAsync();
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
        image_url = ? 
       WHERE id = ?`,
      [
        product.category_id,
        product.name,
        product.description || '',
        product.price,
        product.image_url || '',
        product.id
      ]
    );
    await db.closeAsync();
    return result.changes == 1;
  },

  // Delete a product
  delete: async (id: number): Promise<boolean> => {
    const db = await getDBConnection();
    const result = await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
    await db.closeAsync();
    return result.changes == 1;
  }
}; 