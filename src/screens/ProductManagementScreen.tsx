import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { productRepository, Product, categoryRepository, Category } from '../database';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getRandomCoffeeImage } from '../utils/defaultImages';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductManagement'>;

const ProductManagementScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: undefined,
    category_id: undefined,
    name: '',
    description: '',
    price: 0,
    image_url: undefined,
  });
  const [currentPrice, setCurrentPrice] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const loadData = async () => {
    try {
      // First load products
      console.log('Loading Products...');
      const loadedProducts = await productRepository.getAll();
      console.log('Products loaded successfully:', loadedProducts.map(product => product.name));
      setProducts(loadedProducts);

      // Then load categories
      console.log('Loading categories...');
      const loadedCategories = await categoryRepository.getAll();
      console.log('Categories loaded successfully:', loadedCategories.map(category => category.name));
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleAddProduct = () => {
    setIsEditing(false);
    setCurrentProduct({
      id: undefined,
      category_id: undefined,
      name: '',
      description: '',
      price: 0,
      image_url: undefined,
    });
    setCurrentPrice("");
    setModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setCurrentPrice(product.price.toFixed(2));
    setModalVisible(true);
  };

  const handleDeleteProduct = (id: number) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            await productRepository.delete(id);
            const deletedProduct = products.find(product => product.id === id);
            console.log('Product deleted successfully:', deletedProduct?.name);
            loadData();
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleSaveProduct = async () => {
    const priceNumber = parseFloat(currentPrice);
  
    if (!currentProduct.name) {
      Alert.alert("Error", "Name is required");
      return;
    }
  
    if (isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert("Error", "Price must be a valid number greater than 0");
      return;
    }
  
    try {
      let updatedProduct = { ...currentProduct, price: priceNumber };

      // If no image is uploaded, use a random coffee image
      if (!updatedProduct.image_url) {
        updatedProduct.image_url = getRandomCoffeeImage();
      }
  
      if (isEditing) {
        await productRepository.update(updatedProduct);
      } else {
        await productRepository.create(updatedProduct);
      }
  
      console.log("Product saved successfully:", updatedProduct.name);
      loadData();
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert("Error", "There was an issue saving the product");
    }
  };

  // Request permissions when component mounts
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setCurrentProduct({ ...currentProduct, image_url: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <View style={styles.productItem}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditProduct(item)}
        >
          <Feather name="edit" size={18} color="#6F4E37" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteProduct(item.id)}
        >
          <Feather name="trash-2" size={18} color="#E53935" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      
      <View style={[styles.header, { paddingTop: (insets.top + 10) || 26 }]}>
        <Text style={styles.headerText}>Product Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddProduct}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => (item.id ? item.id.toString() : 'default_id')}
        renderItem={renderProductItem}
        contentContainerStyle={styles.list}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </Text>
            
            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={currentProduct.name}
                onChangeText={(text) => setCurrentProduct({...currentProduct, name: text})}
                placeholder="Product name"
              />
              
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={currentProduct.description}
                onChangeText={(text) => setCurrentProduct({...currentProduct, description: text})}
                placeholder="Product description"
                multiline={true}
                numberOfLines={4}
              />
              
              <Text style={styles.inputLabel}>Price</Text>
              <TextInput
                style={styles.input}
                value={currentPrice}
                onChangeText={(text) => setCurrentPrice(text)}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
              
              <Text style={styles.inputLabel}>Category</Text>
              <Picker
                selectedValue={currentProduct.category_id}
                onValueChange={(itemValue) =>
                  setCurrentProduct({...currentProduct, category_id: itemValue})
                }
                style={styles.picker}
              >
                <Picker.Item label="Select a category" value={undefined} />
                {categories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={category.name}
                    value={category.id}
                  />
                ))}
              </Picker>

              <Text style={styles.inputLabel}>Product Image</Text>
              {currentProduct.image_url && (
                <Image
                  source={{ uri: currentProduct.image_url }}
                  style={styles.previewImage}
                />
              )}
              
              <View style={styles.imageActions}>
                <TouchableOpacity
                  style={[styles.imageButton, styles.uploadButton]}
                  onPress={pickImage}
                >
                  <Feather name="upload" size={20} color="#6F4E37" />
                  <Text style={styles.imageButtonText}>Upload Image</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.imageWarning}>
                <Feather name="info" size={12} color="#6F4E37" /> If no image is uploaded, a random coffee image will be used
              </Text>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={handleSaveProduct}
              >
                <Text style={[styles.buttonText, styles.buttonSaveText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6F4E37',
  },
  addButton: {
    backgroundColor: '#6F4E37',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#6F4E37',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#7D7D7D',
  },
  productActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
    padding: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonSave: {
    backgroundColor: '#6F4E37',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#666',
  },
  buttonSaveText: {
    color: '#FFF',
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
    resizeMode: 'cover',
  },
  imageActions: {
    marginVertical: 8,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#6F4E37',
  },
  uploadButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#6F4E37',
  },
  imageButtonText: {
    marginLeft: 8,
    color: '#6F4E37',
    fontWeight: '500',
  },
  imageWarning: {
    fontSize: 12,
    color: '#6F4E37',
    fontStyle: 'italic',
    marginTop: 4,
    opacity: 0.8,
  },
});

export default ProductManagementScreen; 