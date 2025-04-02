import { CartItem } from './cart';

export type RootStackParamList = {
  Home: undefined;
  Products: { cartItems?: CartItem[] };
  Cart: { cartItems?: CartItem[] };
  Checkout: undefined;
  ProductManagement: undefined;
  CategoryManagement: undefined;
  SalesHistory: undefined;
  Analytics: undefined;
  MainTabs: {
    screen?: string;
    params?: {
      cartItems?: CartItem[];
    };
  };
}; 