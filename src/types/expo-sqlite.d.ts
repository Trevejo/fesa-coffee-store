declare module 'expo-sqlite' {
  export interface SQLiteDatabase {
    getAllAsync<T = any>(sqlStatement: string, params?: any[]): Promise<T[]>;
    getFirstAsync<T = any>(sqlStatement: string, params?: any[]): Promise<T | null>;
    runAsync(sqlStatement: string, params?: any[]): Promise<{
      lastInsertRowId: number;
      changes: number;
    }>;
    execAsync(sqlStatement: string, params?: any[]): Promise<{
      rows: {
        length: number;
        item(index: number): any;
        _array: any[];
      };
      insertId: number;
      rowsAffected: number;
    }>;
    closeAsync(): Promise<void>;
  }

  export function openDatabaseAsync(
    name: string,
    version?: string,
    description?: string,
    size?: number
  ): Promise<SQLiteDatabase>;
} 