import * as SQLite from 'expo-sqlite';
import { testProducts } from '../mocks/products';
import { testCategories } from '../mocks/categories';

// Get database connection
export const getDBConnection = async () => {
  return await SQLite.openDatabaseAsync('coffeeshop.db');
}; 

// Initialize database connection and tables
export const initDatabase = async () => {
  try {
    // Open database connection
    const db = await getDBConnection();
    
    // Create categories table
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      )`
    );
    
    // Create products table with category reference
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )`
    );

    // Create sales table
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        total REAL NOT NULL,
        payment_method TEXT NOT NULL DEFAULT 'Cash'
      )`
    );

    // Create sale items table
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (sale_id) REFERENCES sales (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )`
    );

    await db.closeAsync();
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Insert data for testing
export const insertTestData = async () => {
  try {
    const db = await getDBConnection();

    // Insert categories
    for (const category of testCategories) {
      const result = await db.runAsync(
        'INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)', 
        [category.id, category.name, category.description]
      );
    }
    console.log('Categories test data inserted successfully');

    // Insert products
    for (const product of testProducts) {
      await db.runAsync('INSERT OR IGNORE INTO products (id, category_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?, ?)', [
        product.id,
        product.category_id,
        product.name,
        product.description,
        product.price,
        product.image_url,
      ]);
    }
    console.log('Products test data inserted successfully');

    await db.closeAsync();
  } catch (error) {
    console.error('Error inserting test data:', error);
  }
};
