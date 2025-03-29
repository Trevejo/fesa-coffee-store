declare module 'expo-sqlite' {
  export interface SQLResultSet {
    insertId: number;
    rowsAffected: number;
    rows: {
      length: number;
      item(index: number): any;
      _array: any[];
    };
  }

  export interface SQLTransaction {
    executeSql(
      sqlStatement: string,
      args?: any[],
      callback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
      errorCallback?: (transaction: SQLTransaction, error: Error) => boolean
    ): void;
  }

  export interface SQLiteDatabase {
    transaction(
      callback: (transaction: SQLTransaction) => void,
      errorCallback?: (error: Error) => void,
      successCallback?: () => void
    ): void;
    
    execAsync(
      sqlStatement: string,
      params?: any[]
    ): Promise<SQLResultSet>;
  }

  export function openDatabaseAsync(
    name: string,
    version?: string,
    description?: string,
    size?: number
  ): Promise<SQLiteDatabase>;
} 