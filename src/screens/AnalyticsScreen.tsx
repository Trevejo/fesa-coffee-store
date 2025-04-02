import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sale, salesRepository } from '../database';
import { Feather } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Analytics'>;

const AnalyticsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [topProducts, setTopProducts] = useState<{ name: string; quantity: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const sales = await salesRepository.getAll();
      
      // Calculate top products
      const productSales: { [key: string]: number } = {};
      sales.forEach((sale: Sale) => {
        sale.items.forEach(item => {
          if (item.product_name) {
            productSales[item.product_name] = (productSales[item.product_name] || 0) + item.quantity;
          }
        });
      });

      const sortedProducts = Object.entries(productSales)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      setTopProducts(sortedProducts);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error loading analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return { backgroundColor: '#FFD700' }; // Gold
      case 1:
        return { backgroundColor: '#C0C0C0' }; // Silver
      case 2:
        return { backgroundColor: '#CD7F32' }; // Bronze
      default:
        return { backgroundColor: '#6F4E37' }; // Default brown
    }
  };

  const renderRankIndicator = (index: number) => {
    if (index <= 2) {
      return (
        <View style={[styles.rankIndicator, getRankStyle(index)]}>
          <Feather name="award" size={16} color="#FFF" />
        </View>
      );
    }
    return (
      <View style={[styles.rankIndicator, getRankStyle(index)]}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6F4E37" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#6F4E37" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Analytics</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.titleWrapper}>
              <Feather name="award" size={20} color="#6F4E37" />
              <Text style={styles.sectionTitle}>Top 5 Most Sold Products</Text>
            </View>
          </View>
          {topProducts.map((product, index) => (
            <View key={product.name} style={styles.productItem}>
              {renderRankIndicator(index)}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productQuantity}>
                  <Feather name="shopping-bag" size={12} color="#7D7D7D" /> {product.quantity} units sold
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6F4E37',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6F4E37',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rankIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
  },
  productQuantity: {
    fontSize: 14,
    color: '#7D7D7D',
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AnalyticsScreen; 