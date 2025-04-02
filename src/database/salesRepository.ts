import { getDBConnection } from './database';

export interface SaleItem {
  product_id: number;
  product_name?: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id?: number;
  date: string;
  time: string;
  total: number;
  payment_method: string;
  items: SaleItem[];
}

export const salesRepository = {
  // Create a new sale
  create: async (sale: Sale): Promise<number> => {
    const db = await getDBConnection();
    
    try {
      // Start transaction
      await db.execAsync('BEGIN TRANSACTION');
      
      // Insert sale record
      const result = await db.runAsync(
        `INSERT INTO sales (date, time, total, payment_method) VALUES (?, ?, ?, ?)`,
        [sale.date, sale.time, sale.total, sale.payment_method]
      );
      
      const saleId = result.lastInsertRowId;
      
      // Insert sale items - only use the required fields for the database
      for (const item of sale.items) {
        // Get current product price from database
        const product = await db.getFirstAsync<{ price: number }>('SELECT price FROM products WHERE id = ?', [item.product_id]);
        if (!product) {
          throw new Error(`Product with id ${item.product_id} not found`);
        }

        await db.runAsync(
          `INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
          [saleId, item.product_id, item.quantity, product.price]
        );
      }
      
      // Commit transaction
      await db.execAsync('COMMIT');
      
      return saleId;
    } catch (error) {
      // Rollback on error
      await db.execAsync('ROLLBACK');
      throw error;
    } finally {
      await db.closeAsync();
    }
  },

  // Get all sales
  getAll: async (): Promise<Sale[]> => {
    const db = await getDBConnection();
    
    try {
      // Get all sales with their items
      const result = await db.getAllAsync(
        `SELECT 
          s.id,
          s.date,
          s.time,
          s.total,
          s.payment_method,
          GROUP_CONCAT(
            json_object(
              'product_id', si.product_id,
              'product_name', p.name,
              'quantity', si.quantity,
              'price', si.price
            )
          ) as items
        FROM sales s
        LEFT JOIN sale_items si ON s.id = si.sale_id
        LEFT JOIN products p ON si.product_id = p.id
        GROUP BY s.id
        ORDER BY s.date DESC, s.time DESC`
      );
      
      return result.map((row: any) => ({
        ...row,
        items: row.items ? JSON.parse(`[${row.items}]`) : []
      }));
    } finally {
      await db.closeAsync();
    }
  }
}; 