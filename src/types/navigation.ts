import { CartItem } from './cart';

export type RootStackParamList = {
  Home: undefined;
  Products: { cartItems?: CartItem[] };
  ProductDetails: { productId: string };
  Cart: { cartItems?: CartItem[] };
  Checkout: undefined;
  ProductManagement: undefined;
  CategoryManagement: undefined;
  SalesHistory: undefined;
  MainTabs: undefined;
}; 