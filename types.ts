// Fix: Create the types.ts file with all necessary type definitions.
export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface Product {
  id:string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: string;
  type: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export enum OrderStatus {
  PENDING_PAYMENT = 'قيد انتظار الدفع',
  PENDING_CONFIRMATION = 'قيد تأكيد الدفع',
  COMPLETED = 'مكتمل',
  FAILED = 'فشل',
  CANCELLED = 'ملغي',
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  paymentMethod: 'Credit Card' | 'Bank Transfer';
  proofOfPaymentUrl?: string;
  downloadLink?: string;
}
