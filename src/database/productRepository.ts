import { getDBConnection } from './database';

export interface Product {
  id?: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
}

export const productRepository = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    const db = await getDBConnection();
    const result = await db.getAllAsync('SELECT * FROM products ORDER BY name');
    await db.closeAsync();
    //return result.rows._array as Product[];
    return result as Product[];
  },

  // Get product by id
  getById: async (id: number): Promise<Product | null> => {
    const db = await getDBConnection();
    const result = await db.execAsync('SELECT * FROM products WHERE id = ?', [id]);
    if (result.rows.length > 0) {
      return result.rows._array[0] as Product;
    }
    return null;
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
    const result = await db.execAsync(
      `INSERT INTO products (
        category_id, name, description, price, image_url, available
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        product.category_id,
        product.name,
        product.description || '',
        product.price,
        product.image_url || '',
      ]
    );
    return result.insertId;
  },

  // Update an existing product
  update: async (product: Product): Promise<boolean> => {
    if (!product.id) {
      throw new Error('Product ID is required for updates');
    }

    const db = await getDBConnection();
    const result = await db.execAsync(
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
        product.id
      ]
    );
    return result.rowsAffected > 0;
  },

  // Delete a product
  delete: async (id: number): Promise<boolean> => {
    const db = await getDBConnection();
    const result = await db.execAsync('DELETE FROM products WHERE id = ?', [id]);
    return result.rowsAffected > 0;
  }
}; 