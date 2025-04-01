import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { initDatabase, insertTestData } from './src/database';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CoffeeProductListing from './src/screens/CoffeeProductListing';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import ProductManagementScreen from './src/screens/ProductManagementScreen';
import CategoryManagementScreen from './src/screens/CategoryManagementScreen';
import SalesHistoryScreen from './src/screens/SalesHistoryScreen';
import CartScreen from './src/screens/CartScreen';
import { RootStackParamList } from './src/types/navigation';

// For the main navigation flow
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Main tab navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Products') {
            iconName = focused ? 'cafe' : 'cafe-outline';
          } else if (route.name === 'ProductManagement') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'CategoryManagement') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'SalesHistory') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          // You can return any component here!
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6F4E37',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hide the header for tab screens
      })}
    >
      <Tab.Screen 
        name="Products" 
        component={CoffeeProductListing}
        options={{ title: 'Products' }}
      />
      <Tab.Screen 
        name="ProductManagement" 
        component={ProductManagementScreen} 
        options={{ title: 'Products' }}
      />
      <Tab.Screen 
        name="CategoryManagement" 
        component={CategoryManagementScreen}
        options={{ title: 'Categories' }}
      />
      <Tab.Screen 
        name="SalesHistory" 
        component={SalesHistoryScreen}
        options={{ title: 'History' }}
      />
    </Tab.Navigator>
  );
}

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
        await insertTestData();
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
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, // Hide header for all stack screens by default
          }}
        >
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator} 
          />
          <Stack.Screen 
            name="ProductDetails" 
            component={ProductDetailsScreen}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen}
          />
        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
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
    color: '#6F4E37',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
