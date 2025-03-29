import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = ({ route, navigation }: Props) => {
  const { productId } = route.params;

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
      
      <Button 
        title="Back to Products" 
        onPress={() => navigation.goBack()} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#4CAF50',
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
});

export default ProductDetailsScreen; 