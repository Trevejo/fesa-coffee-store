import { getDBConnection } from './database';

export interface Category {
  id?: number;
  name: string;
  description?: string;
}

export const categoryRepository = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const db = await getDBConnection();
    try {
      const result = await db.getAllAsync('SELECT * FROM categories ORDER BY name');
      return result as Category[];
    } finally {
      await db.closeAsync();
    }
  },

  // Get category by id
  getById: async (id: number): Promise<Category | null> => {
    const db = await getDBConnection();
    try {
      const result = await db.execAsync('SELECT * FROM categories WHERE id = ?', [id]);
      if (result.rows.length > 0) {
        return result.rows._array[0] as Category;
      }
      return null;
    } finally {
      await db.closeAsync();
    }
  },

  // Create a new category
  create: async (category: Category): Promise<number> => {
    const db = await getDBConnection();
    try {
      const result = await db.runAsync(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [category.name, category.description || '']
      );
      return result.lastInsertRowId;
    } finally {
      await db.closeAsync();
    }
  },

  // Update an existing category
  update: async (category: Category): Promise<boolean> => {
    if (!category.id) {
      throw new Error('Category ID is required for updates');
    }

    const db = await getDBConnection();
    try {
      const result = await db.runAsync(
        'UPDATE categories SET name = ?, description = ? WHERE id = ?',
        [category.name, category.description || '', category.id]
      );
      return result.changes == 1;
    } finally {
      await db.closeAsync();
    }
  },

  // Delete a category
  delete: async (id: number): Promise<boolean> => {
    const db = await getDBConnection();
    try {
      const result = await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
      return result.changes == 1;
    } finally {
      await db.closeAsync();
    }
  }
}; 