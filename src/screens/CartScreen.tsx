import React from 'react';
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { CartItem } from '../types/cart';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { productRepository, Product } from '../database';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const CartScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const [cartItems, setCartItems] = useState<CartItem[]>(route.params?.cartItems || []);

  useEffect(() => {
    const loadItemsDetails = async () => {
      const updatedItems = await Promise.all(
        cartItems.map(async (item) => {
          const details = await productRepository.getById(item.id);
          if (!details) return item;
          return { ...item, name: details.name, description: details.description };
        })
      );
      setCartItems(updatedItems);
    };

    if (cartItems.length > 0 && cartItems.some(item => !item.name || !item.description)) {
      console.log('Loading items details...');
      loadItemsDetails();
    }
  }, []);


  const handleIncrement = (id: number) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
    navigation.setParams({ cartItems: updatedItems });
  };

  const handleDecrement = (id: number) => {
    const updatedItems = cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedItems);
    navigation.setParams({ cartItems: updatedItems });
  };

  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <View style={[styles.header, { paddingTop: (insets.top + 10) || 26 }]}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#6F4E37" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <View style={styles.quantityControl}>
              <TouchableOpacity onPress={() => handleDecrement(item.id)} style={styles.actionButton}>
                <Feather name="minus" size={18} color="#6F4E37" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => handleIncrement(item.id)} style={styles.actionButton}>
                <Feather name="plus" size={18} color="#6F4E37" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6F4E37',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 16,
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  list: {
    paddingVertical: 10,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#F3E5AB",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6F4E37",
    marginHorizontal: 8,
  },
});

export default CartScreen; 