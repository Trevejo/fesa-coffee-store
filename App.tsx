import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { initDatabase } from './src/database';

export default function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDb = async () => {
      try {
        await initDatabase();
        setIsDbInitialized(true);
      } catch (err) {
        console.error('Error initializing database:', err);
        setError('Failed to initialize database');
      }
    };

    initDb();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coffee Shop App</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : !isDbInitialized ? (
        <Text>Initializing database...</Text>
      ) : (
        <Text>Database initialized successfully!</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
