import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { initDatabase } from './src/database';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CoffeeProductListing from './src/screens/CoffeeProductListing';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import ProductManagementScreen from './src/screens/ProductManagementScreen';
import CategoryManagementScreen from './src/screens/CategoryManagementScreen';
import SalesHistoryScreen from './src/screens/SalesHistoryScreen';
import CartScreen from './src/screens/CartScreen';
import { RootStackParamList } from './src/types/navigation';

// For the main navigation flow
const Stack = createNativeStackNavigator<RootStackParamList>();

// HomeScreen for navigation hub
const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.title}>Coffee Shop App</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Coffee Products" 
          onPress={() => navigation.navigate('Products')}
          color="#6F4E37"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Product Management" 
          onPress={() => navigation.navigate('ProductManagement')}
          color="#6F4E37"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Category Management" 
          onPress={() => navigation.navigate('CategoryManagement')}
          color="#6F4E37"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Sales History" 
          onPress={() => navigation.navigate('SalesHistory')}
          color="#6F4E37"
        />
      </View>
    </View>
  );
};

// Loading and error screens
const LoadingScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Coffee Shop App</Text>
    <Text>Initializing database...</Text>
  </View>
);

const ErrorScreen = ({ error }: { error: string }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Coffee Shop App</Text>
    <Text style={styles.error}>{error}</Text>
  </View>
);

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
        <ErrorScreen error={error} />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (!isDbInitialized) {
    return (
      <View style={styles.container}>
        <LoadingScreen />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6F4E37',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Coffee Shop' }}
        />
        <Stack.Screen 
          name="Products" 
          component={CoffeeProductListing}
          options={{ title: 'Coffee Products' }}
        />
        <Stack.Screen 
          name="ProductDetails" 
          component={ProductDetailsScreen}
          options={{ title: 'Product Details' }}
        />
        <Stack.Screen 
          name="ProductManagement" 
          component={ProductManagementScreen}
          options={{ title: 'Product Management' }}
        />
        <Stack.Screen 
          name="CategoryManagement" 
          component={CategoryManagementScreen}
          options={{ title: 'Category Management' }}
        />
        <Stack.Screen 
          name="SalesHistory" 
          component={SalesHistoryScreen}
          options={{ title: 'Sales History' }}
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen}
          options={{ title: 'Your Cart' }}
        />
      </Stack.Navigator>
      <StatusBar style="light" />
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
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6F4E37',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
});
