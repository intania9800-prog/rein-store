export type CategoryType = 
  | 'game'
  | 'pulsa'
  | 'pln'
  | 'tagihan'
  | 'digital';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  description?: string;
  bonus?: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  subCategory?: string;
  description: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  iconType: string;
  badge?: string;
  inputPlaceholder?: string;
  inputLabel?: string;
  secondaryInputLabel?: string;
  secondaryInputPlaceholder?: string;
  requiresServer?: boolean;
  serverList?: string[];
  variants: ProductVariant[];
  isSpecialDNS?: boolean;
  isSpecialTreasury?: boolean;
  isGestun?: boolean;
}

export type PaymentMethodId = 
  | 'qris'
  | 'bca'
  | 'seabank'
  | 'mandiri'
  | 'bri'
  | 'bni'
  | 'bsi'
  | 'dana'
  | 'gopay'
  | 'ovo'
  | 'shopeepay'
  | 'krom'
  | 'alfamart'
  | 'indomaret'
  | (string & {});

export interface PaymentMethodInfo {
  id: PaymentMethodId;
  name: string;
  category: 'qris' | 'bank' | 'ewallet' | 'retail';
  accountNumber?: string;
  accountName?: string;
  fee: number;
  isAvailableForDNS?: boolean;
  badge?: string;
  bankCode?: string;
}

export interface GestunProvider {
  id: string;
  name: string;
  feePercent: number;
  note: string;
}

export type OrderStatus = 'pending' | 'success' | 'cancelled';

export interface Order {
  id: string;
  invoiceNumber: string;
  productId: string;
  productName: string;
  category: CategoryType;
  variantId: string;
  variantName: string;
  targetAccount: string; // e.g. Game ID, Phone No, Meter No
  targetZone?: string;   // e.g. Server / Zone ID
  customerEmail: string;
  customerWhatsApp: string;
  basePrice: number;
  adminFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethodId;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
  // Specific fields for Gestun
  isGestun?: boolean;
  gestunProvider?: string;
  gestunPayoutAmount?: number;
  payoutBank?: string;
  payoutAccount?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified2FA: boolean;
  twoFactorSecret?: string;
  role: 'user' | 'admin';
}

export interface SlidePoster {
  id: string;
  title: string;
  imageUrl: string;
  badge?: string;
  linkType?: 'scroll_products' | 'category' | 'product' | 'none';
  linkTarget?: string;
  isActive: boolean;
  createdAt: number;
  fitMode?: 'cover' | 'contain';
  width?: number;
  height?: number;
}
