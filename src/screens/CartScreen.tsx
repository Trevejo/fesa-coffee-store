import React from 'react';
import { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { CartItem } from '../types/cart';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { productRepository, Product } from '../database';
import { salesRepository, Sale } from '../database/salesRepository';

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
          return { 
            ...item, 
            name: details.name, 
            description: details.description,
            price: details.price 
          };
        })
      );
      setCartItems(updatedItems);
    };

    if (cartItems.length > 0 && cartItems.some(item => !item.name || !item.description || !item.price)) {
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

  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (item.price || 0) * item.quantity, 0
    );
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cartItems]);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handlePurchase = async () => {
    try {
      const now = new Date();
      const sale: Sale = {
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        total,
        payment_method: 'Cash',
        items: cartItems.map(item => ({
          product_name: item.name,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price || 0
        }))
      };

      console.log('sale' + JSON.stringify(sale));

      await salesRepository.create(sale);
      
      Alert.alert(
        'Purchase Successful!',
        'Thank you for your purchase!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.setParams({ cartItems: [] });
              navigation.navigate('MainTabs', {
                screen: 'Products',
                params: { cartItems: [] }
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error processing purchase:', error);
      Alert.alert(
        'Error',
        'There was an error processing your purchase. Please try again.'
      );
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price || 0)}</Text>
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
  );

  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax (10%)</Text>
        <Text style={styles.summaryValue}>{formatPrice(tax)}</Text>
      </View>
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.purchaseButton}
        onPress={handlePurchase}
      >
        <Text style={styles.purchaseButtonText}>Complete Purchase</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <View style={[styles.header, { paddingTop: (insets.top + 10) || 26 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#6F4E37" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>
      
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
          </View>
        }
      />

      {cartItems.length > 0 && renderSummary()}
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
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    position: 'relative',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6F4E37',
    textAlign: 'center',
    marginRight: 40,
  },
  backButton: {
    padding: 8,
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
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: "#6F4E37",
    fontWeight: "600",
    marginTop: 4,
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
  summaryContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6F4E37',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6F4E37',
  },
  purchaseButton: {
    backgroundColor: '#6F4E37',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default CartScreen; 