import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { initDatabase } from './src/database';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CoffeeProductListing from './src/screens/CoffeeProductListing';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

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

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Coffee Shop App</Text>
        <Text style={styles.error}>{error}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (!isDbInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Coffee Shop App</Text>
        <Text>Initializing database...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Products"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6F4E37', // Coffee brown
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Products" 
          component={CoffeeProductListing}
          options={{
            title: 'Coffee Products'
          }}
        />
        <Stack.Screen 
          name="ProductDetails" 
          component={ProductDetailsScreen}
          options={{
            title: 'Product Details'
          }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
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
