import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = ({ route, navigation }: Props) => {
  const { productId } = route.params;
  const insets = useSafeAreaInsets();

  // In a real app, you would fetch the product details from the database
  // This is just a placeholder
  const product = {
    id: productId,
    name: 'Sample Coffee',
    price: 4.99,
    description: 'A delicious coffee sample',
    ingredients: 'Coffee beans, water',
    preparation: 'Brewed at optimal temperature'
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#6F4E37" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text>{product.ingredients}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preparation</Text>
          <Text>{product.preparation}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Back to Products" 
            onPress={() => navigation.goBack()}
            color="#6F4E37"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  backButton: {
    position: 'absolute',
    left: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#6F4E37',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 16,
  },
});

export default ProductDetailsScreen; 