import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StatusBar
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Category, categoryRepository } from '../database'; 

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryManagement'>;

// Sample category data - in a real app, this would come from a database
const initialCategories = [
  {
    id: '1',
    name: 'Hot Coffee',
    description: 'Warm coffee beverages served hot'
  },
  {
    id: '2',
    name: 'Cold Coffee',
    description: 'Chilled coffee beverages served cold or with ice'
  },
  {
    id: '3',
    name: 'Seasonal',
    description: 'Limited time special coffee offerings'
  }
];

const CategoryManagementScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  //const [categories, setCategories] = useState(initialCategories);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>({
    id: undefined,
    name: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
      loadCategories();
    }, []);

  const loadCategories = async () => {
    console.log('Loading categories...');
    try {
      const loadedCategories = await categoryRepository.getAll();
      console.log('Categories loaded successfully:', loadedCategories.map(category => category.name));
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddCategory = () => {
    setIsEditing(false);
    setCurrentCategory({
      id: undefined,
      name: '',
      description: ''
    });
    setModalVisible(true);
  };

  const handleEditCategory = (category: any) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setModalVisible(true);
  };

  const handleDeleteCategory = (id: number) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            await categoryRepository.delete(id);
            const deletedCategory = categories.find(item => item.id === id);
            console.log('Category deleted successfully:', deletedCategory?.name);
            loadCategories();
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleSaveCategory = async () => {
    if (!currentCategory.name) {
      Alert.alert("Error", "Category name is required");
      return;
    }

    try {
      if (isEditing) {
        await categoryRepository.update(currentCategory);
      } else {
        await categoryRepository.create(currentCategory);
      }
  
      console.log('Category saved successfully:', currentCategory.name);
      loadCategories();
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving category:', error);
      Alert.alert("Error", "There was an issue saving the category");
    }
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
      </View>
      <View style={styles.categoryActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditCategory(item)}
        >
          <Feather name="edit" size={18} color="#6F4E37" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteCategory(item.id)}
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
        <Text style={styles.headerText}>Category Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddCategory}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={item => (item.id ? item.id.toString() : 'default_id')}
        renderItem={renderCategoryItem}
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
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </Text>
            
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={currentCategory.name}
              onChangeText={(text) => setCurrentCategory({...currentCategory, name: text})}
              placeholder="Category name"
            />
            
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={currentCategory.description}
              onChangeText={(text) => setCurrentCategory({...currentCategory, description: text})}
              placeholder="Category description"
              multiline={true}
              numberOfLines={4}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={handleSaveCategory}
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
  categoryItem: {
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
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#7D7D7D',
  },
  categoryActions: {
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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

export default CategoryManagementScreen; 