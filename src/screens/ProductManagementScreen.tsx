import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductManagement'>;

// Sample product data - in a real app, this would come from a database
const initialProducts = [
  {
    id: '1',
    name: 'Espresso',
    description: 'Strong concentrated coffee served in small shots',
    price: 3.99,
    category: 'Hot Coffee'
  },
  {
    id: '2',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk foam',
    price: 4.99,
    category: 'Hot Coffee'
  },
  {
    id: '3',
    name: 'Iced Americano',
    description: 'Espresso diluted with cold water and ice',
    price: 4.49,
    category: 'Cold Coffee'
  },
];

const ProductManagementScreen = ({ navigation }: Props) => {
  const [products, setProducts] = useState(initialProducts);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleAddProduct = () => {
    setIsEditing(false);
    setCurrentProduct({
      id: Date.now().toString(),
      name: '',
      description: '',
      price: '',
      category: ''
    });
    setModalVisible(true);
  };

  const handleEditProduct = (product: any) => {
    setIsEditing(true);
    setCurrentProduct({
      ...product,
      price: product.price.toString()
    });
    setModalVisible(true);
  };

  const handleDeleteProduct = (id: string) => {
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
          onPress: () => {
            setProducts(products.filter(product => product.id !== id));
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleSaveProduct = () => {
    if (!currentProduct.name || !currentProduct.price) {
      Alert.alert("Error", "Name and price are required");
      return;
    }

    const price = parseFloat(currentProduct.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Error", "Price must be a valid number greater than 0");
      return;
    }

    if (isEditing) {
      setProducts(products.map(product => 
        product.id === currentProduct.id 
          ? { ...currentProduct, price } 
          : product
      ));
    } else {
      setProducts([...products, { ...currentProduct, price }]);
    }
    
    setModalVisible(false);
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
      <View style={styles.header}>
        <Text style={styles.headerText}>Manage Products</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddProduct}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
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
                value={currentProduct.price}
                onChangeText={(text) => setCurrentProduct({...currentProduct, price: text})}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
              
              <Text style={styles.inputLabel}>Category</Text>
              <TextInput
                style={styles.input}
                value={currentProduct.category}
                onChangeText={(text) => setCurrentProduct({...currentProduct, category: text})}
                placeholder="Product category"
              />
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
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
});

export default ProductManagementScreen; 