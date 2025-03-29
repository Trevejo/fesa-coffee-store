import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'SalesHistory'>;

// Sample sales data - in a real app, this would come from a database
const salesData = [
  {
    id: '1',
    date: '2023-06-12',
    time: '10:22 AM',
    total: 13.97,
    items: [
      { name: 'Espresso', quantity: 2, price: 3.99 },
      { name: 'Cappuccino', quantity: 1, price: 5.99 }
    ],
    paymentMethod: 'Credit Card'
  },
  {
    id: '2',
    date: '2023-06-11',
    time: '3:45 PM',
    total: 22.96,
    items: [
      { name: 'Iced Americano', quantity: 2, price: 4.49 },
      { name: 'Mocha Frappuccino', quantity: 2, price: 5.99 }
    ],
    paymentMethod: 'Cash'
  },
  {
    id: '3',
    date: '2023-06-10',
    time: '1:12 PM',
    total: 9.98,
    items: [
      { name: 'Cold Brew', quantity: 2, price: 4.99 }
    ],
    paymentMethod: 'Credit Card'
  },
  {
    id: '4',
    date: '2023-06-10',
    time: '11:30 AM',
    total: 15.96,
    items: [
      { name: 'Caramel Macchiato', quantity: 2, price: 5.49 },
      { name: 'Espresso', quantity: 1, price: 4.98 }
    ],
    paymentMethod: 'Digital Wallet'
  }
];

const SalesHistoryScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };
  
  const renderSaleItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.saleItem}>
      <View style={styles.saleHeader}>
        <Text style={styles.saleDate}>{item.date} at {item.time}</Text>
        <Text style={styles.saleAmount}>{formatCurrency(item.total)}</Text>
      </View>
      
      <View style={styles.saleDetails}>
        <Text style={styles.paymentMethod}>
          <Feather 
            name={item.paymentMethod === 'Cash' ? 'dollar-sign' : item.paymentMethod === 'Digital Wallet' ? 'smartphone' : 'credit-card'} 
            size={14} 
            color="#6F4E37" 
          /> {item.paymentMethod}
        </Text>
        <Text style={styles.itemCount}>
          <Feather name="shopping-bag" size={14} color="#6F4E37" /> {item.items.length} item{item.items.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      <View style={styles.itemsList}>
        {item.items.map((orderItem: any, index: number) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.orderItemName}>
              {orderItem.quantity}x {orderItem.name}
            </Text>
            <Text style={styles.orderItemPrice}>
              {formatCurrency(orderItem.price * orderItem.quantity)}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      
      <View style={[styles.header, { paddingTop: (insets.top + 10) || 26 }]}>
        <Text style={styles.headerText}>Sales History</Text>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{salesData.length}</Text>
          <Text style={styles.statLabel}>Total Sales</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatCurrency(salesData.reduce((sum, sale) => sum + sale.total, 0))}
          </Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
      </View>
      
      <FlatList
        data={salesData}
        keyExtractor={item => item.id}
        renderItem={renderSaleItem}
        contentContainerStyle={styles.list}
      />
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
  }
});

export default SalesHistoryScreen; 