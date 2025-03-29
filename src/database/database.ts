import * as SQLite from 'expo-sqlite';

// Initialize database connection and tables
export const initDatabase = async () => {
  try {
    // Open database connection
    const db = await SQLite.openDatabaseAsync('coffeeshop.db');
    
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
        available BOOLEAN DEFAULT 1,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )`
    );
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get database connection (should be called after initDatabase)
export const getDBConnection = async () => {
  return await SQLite.openDatabaseAsync('coffeeshop.db');
}; 