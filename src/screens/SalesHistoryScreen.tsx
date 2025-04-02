import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sale, SaleItem, salesRepository } from '../database';
import { resetDatabase } from '../database/database';

type Props = NativeStackScreenProps<RootStackParamList, 'SalesHistory'>;

const SalesHistoryScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tapCount, setTapCount] = useState(0);
  
  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const salesData = await salesRepository.getAll();
      setSales(salesData);
    } catch (err) {
      setError('Failed to load sales history');
      console.error('Error loading sales:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };
  
  const handleTitlePress = async () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    
    if (newCount === 5) {
      setTapCount(0);
      Alert.alert(
        'Reset Database',
        'Are you sure you want to completely reset the database? This will delete ALL data and recreate tables with initial test data.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: async () => {
              try {
                setIsLoading(true);
                await resetDatabase();
                await loadSales();
                Alert.alert('Success', 'Database has been completely reset with initial test data');
              } catch (err) {
                console.error('Error resetting database:', err);
                Alert.alert('Error', 'Failed to reset database');
              } finally {
                setIsLoading(false);
              }
            }
          }
        ]
      );
    }
  };
  
  const renderSaleItem = ({ item }: { item: Sale }) => (
    <TouchableOpacity style={styles.saleItem}>
      <View style={styles.saleHeader}>
        <Text style={styles.saleDate}>{item.date} at {item.time}</Text>
        <Text style={styles.saleAmount}>{formatCurrency(item.total)}</Text>
      </View>
      
      <View style={styles.saleDetails}>
        <Text style={styles.paymentMethod}>
          <Feather 
            name={item.payment_method === 'Cash' ? 'dollar-sign' : item.payment_method === 'Digital Wallet' ? 'smartphone' : 'credit-card'} 
            size={14} 
            color="#6F4E37" 
          /> {item.payment_method}
        </Text>
        <Text style={styles.itemCount}>
          <Feather name="shopping-bag" size={14} color="#6F4E37" /> {item.items.length} item{item.items.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      <View style={styles.itemsList}>
        {item.items.map((orderItem: SaleItem, index: number) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.orderItemName}>
              {orderItem.quantity}x {orderItem.product_name}
            </Text>
            <Text style={styles.orderItemPrice}>
              {formatCurrency(orderItem.quantity * orderItem.price)}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

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
        <TouchableOpacity style={styles.retryButton} onPress={loadSales}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      
      <View style={[styles.header, { paddingTop: (insets.top + 10) || 26 }]}>
        <TouchableOpacity onPress={handleTitlePress}>
          <Text style={styles.headerText}>Sales History</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{sales.length}</Text>
          <Text style={styles.statLabel}>Total Sales</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatCurrency(sales.reduce((sum, sale) => sum + sale.total, 0))}
          </Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
      </View>
      
      <FlatList
        data={sales}
        keyExtractor={item => item.id?.toString() || ''}
        renderItem={renderSaleItem}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={loadSales}
      />
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
    justifyContent: 'flex-start',
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
  stats: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6F4E37',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7D7D7D',
  },
  list: {
    padding: 16,
  },
  saleItem: {
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
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  saleDate: {
    fontSize: 14,
    color: '#7D7D7D',
  },
  saleAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6F4E37',
  },
  saleDetails: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
    marginRight: 16,
  },
  itemCount: {
    fontSize: 12,
    color: '#666',
  },
  itemsList: {
    marginTop: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderItemName: {
    fontSize: 13,
    color: '#333',
  },
  orderItemPrice: {
    fontSize: 13,
    color: '#333',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6F4E37',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default SalesHistoryScreen; 