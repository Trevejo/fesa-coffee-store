import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { productRepository, Product } from '../database';
import { CartItem } from '../types/cart';

// Sample coffee product data
const coffeeProducts = [
  {
    id: '1',
    name: 'Espresso',
    description: 'Strong concentrated coffee served in small shots',
    price: 3.99,
    image: 'https://picsum.photos/id/431/300/300',
    rating: 4.8,
    category: 'Hot Coffee'
  },
  {
    id: '2',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk foam',
    price: 4.99,
    image: 'https://picsum.photos/id/425/300/300',
    rating: 4.7,
    category: 'Hot Coffee'
  },
  {
    id: '3',
    name: 'Iced Americano',
    description: 'Espresso diluted with cold water and ice',
    price: 4.49,
    image: 'https://picsum.photos/id/493/300/300',
    rating: 4.5,
    category: 'Cold Coffee'
  },
  {
    id: '4',
    name: 'Caramel Macchiato',
    description: 'Espresso with vanilla syrup, milk and caramel drizzle',
    price: 5.49,
    image: 'https://picsum.photos/id/435/300/300',
    rating: 4.9,
    category: 'Hot Coffee'
  },
  {
    id: '5',
    name: 'Cold Brew',
    description: 'Coffee brewed with cold water over extended time',
    price: 4.99,
    image: 'https://picsum.photos/id/430/300/300',
    rating: 4.6,
    category: 'Cold Coffee'
  },
  {
    id: '6',
    name: 'Mocha Frappuccino',
    description: 'Blended coffee with chocolate, milk and ice',
    price: 5.99,
    image: 'https://picsum.photos/id/437/300/300',
    rating: 4.7,
    category: 'Cold Coffee'
  },
];

// Categories for filtering
const categories = ['All', 'Hot Coffee', 'Cold Coffee', 'Seasonal'];

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

const CoffeeProductListing = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>(route.params?.cartItems ?? []);

  useEffect(() => {
    const loadProducts = async () => {
      console.log('Loading products...');
      try {
        const loadedProducts = await productRepository.getAll();
        console.log('Products loaded successfully:', loadedProducts.map(product => product.name));
        setProducts(loadedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = (item: Product) => {
    if (item.id === undefined) return;

    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    const updatedCartItems: CartItem[] = existingItem
      ? cartItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      : [...cartItems, { id: item.id, quantity: 1 }];

    console.log('Cart updated:', updatedCartItems);
    setCartItems(updatedCartItems);
    navigation.setParams({ cartItems: updatedCartItems });
  };

  // Filter products based on category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category_id?.toString() === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Render individual product card
  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id?.toString() || '' })}
    >
      <Image source={{ uri: item.image_url || 'https://picsum.photos/300/300' }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>4.5</Text>
        </View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description || ''}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
            <Feather name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render category pill
  const renderCategoryPill = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryPill,
        selectedCategory === category && styles.selectedCategoryPill
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category && styles.selectedCategoryText
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      
      {/* Custom Header */}
      <View style={[styles.headerContainer, { paddingTop: (insets.top + 10) || 26 }]}>
        <Text style={styles.headerTitle}>Coffee Products</Text>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart', { cartItems })}
        >
          <View style={styles.cartIconContainer}>
            <Feather name="shopping-bag" size={24} color="#6F4E37" />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#7D7D7D" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search coffee..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => renderCategoryPill(category))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={item => item.id?.toString() || ''}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6F4E37',
  },
  cartButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  selectedCategoryPill: {
    backgroundColor: '#6F4E37',
  },
  categoryText: {
    fontSize: 14,
    color: '#7D7D7D',
  },
  selectedCategoryText: {
    color: '#FFF',
    fontWeight: '500',
  },
  productList: {
    padding: 8,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#7D7D7D',
    marginLeft: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#7D7D7D',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6F4E37',
  },
  addButton: {
    backgroundColor: '#6F4E37',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#6F4E37',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CoffeeProductListing;