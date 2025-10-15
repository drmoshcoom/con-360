// Fix: Create the services/api.ts file with a mock API implementation.
import { Product, User, Order, OrderStatus, CartItem } from '../types';

// --- MOCK DATA ---

const users: User[] = [
  { id: '1', email: 'admin@example.com', isAdmin: true },
  { id: '2', email: 'buyer@example.com', isAdmin: false },
];

const products: Product[] = [
  {
    id: 'prod_1',
    name: 'كتاب الطبخ الرقمي',
    description: 'مجموعة من 50 وصفة صحية وسهلة. مثالية للمبتدئين والمحترفين على حد سواء. احصل على نسختك اليوم!',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-2850a80b6b51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    seller: 'مطبخ سارة',
    type: 'كتاب إلكتروني',
  },
  {
    id: 'prod_2',
    name: 'قالب موقع شخصي',
    description: 'قالب HTML/CSS حديث وسريع الاستجابة لعرض أعمالك. سهل التخصيص ويدعم جميع المتصفحات الحديثة.',
    price: 25.00,
    imageUrl: 'https://images.unsplash.com/photo-1559028006-44a36f1159d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1003&q=80',
    seller: 'أكواد نظيفة',
    type: 'قالب ويب',
  },
   {
    id: 'prod_3',
    name: 'مجموعة أيقونات فنية',
    description: 'أكثر من 200 أيقونة SVG عالية الجودة لمشاريعك. تصميم بسيط ومتناسق، مثالي لتطبيقات الويب والجوال.',
    price: 9.50,
    imageUrl: 'https://images.unsplash.com/photo-1621452298773-455b741539e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    seller: 'فن البكسل',
    type: 'أصول رقمية',
  },
   {
    id: 'prod_4',
    name: 'دورة تصميم UX/UI',
    description: 'تعلم أساسيات تصميم تجربة وواجهة المستخدم في هذه الدورة الشاملة. فيديوهات تعليمية وملفات عمل.',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
    seller: 'أكاديمية التصميم',
    type: 'دورة تعليمية',
  },
];

let orders: Order[] = [
    {
        id: 'ord_123',
        userId: '2',
        items: [{ product: products[0], quantity: 1 }],
        total: 15.99,
        status: OrderStatus.COMPLETED,
        createdAt: new Date('2023-10-26T10:00:00Z'),
        paymentMethod: 'Credit Card',
        downloadLink: '#',
    },
    {
        id: 'ord_124',
        userId: '2',
        items: [{ product: products[1], quantity: 1 }, { product: products[2], quantity: 2 }],
        total: 44.00,
        status: OrderStatus.PENDING_CONFIRMATION,
        createdAt: new Date('2023-10-27T14:30:00Z'),
        paymentMethod: 'Bank Transfer',
        proofOfPaymentUrl: 'https://i.imgur.com/3zL4b1r.png',
    },
];

// --- MOCK API ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// A mock session state that synchronizes with localStorage
let currentUser: User | null = null;
try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
} catch (e) {
    console.error("Failed to parse user from localStorage", e);
    currentUser = null;
}

export const api = {
  login: async (email: string, pass: string): Promise<User | null> => {
    await delay(500);
    const user = users.find(u => u.email === email);
    // Password check is ignored for this mock
    if (user) {
        currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    }
    return null;
  },

  logout: async (): Promise<void> => {
      currentUser = null;
      localStorage.removeItem('user');
      await delay(200);
  },

  getCurrentUser: async (): Promise<User | null> => {
      return currentUser;
  },

  getProducts: async (): Promise<Product[]> => {
    await delay(300);
    return products;
  },
  
  getProductById: async (id: string): Promise<Product | undefined> => {
    await delay(200);
    return products.find(p => p.id === id);
  },

  getUserOrders: async (): Promise<Order[]> => {
      await delay(700);
      if (!currentUser) return [];
      return orders.filter(o => o.userId === currentUser?.id);
  },
  
  getAdminOrders: async (): Promise<Order[]> => {
      await delay(700);
      if (currentUser?.isAdmin) {
        return orders;
      }
      return [];
  },

  confirmBankTransfer: async (orderId: string): Promise<Order | undefined> => {
      await delay(1000);
      const orderIndex = orders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1 && currentUser?.isAdmin) {
          orders[orderIndex].status = OrderStatus.COMPLETED;
          orders[orderIndex].downloadLink = '#'; // Generate a mock download link
          return orders[orderIndex];
      }
      return undefined;
  },

  createOrder: async (items: CartItem[], paymentMethod: 'Credit Card' | 'Bank Transfer'): Promise<Order | null> => {
    await delay(1200);
    if (!currentUser || items.length === 0) return null;

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    const newOrder: Order = {
        id: `ord_${Math.random().toString(36).substring(2, 9)}`,
        userId: currentUser.id,
        items,
        total,
        status: paymentMethod === 'Credit Card' ? OrderStatus.COMPLETED : OrderStatus.PENDING_PAYMENT,
        createdAt: new Date(),
        paymentMethod,
        downloadLink: paymentMethod === 'Credit Card' ? '#' : undefined,
    };
    
    orders.push(newOrder);

    // For bank transfers, simulate the user "uploading" a proof of payment after a delay.
    if (paymentMethod === 'Bank Transfer') {
        setTimeout(() => {
            const orderIndex = orders.findIndex(o => o.id === newOrder.id);
            if (orderIndex !== -1 && orders[orderIndex].status === OrderStatus.PENDING_PAYMENT) {
                orders[orderIndex].status = OrderStatus.PENDING_CONFIRMATION;
                orders[orderIndex].proofOfPaymentUrl = 'https://i.imgur.com/3zL4b1r.png'; // Mock proof
            }
        }, 10000); // Simulate user uploading proof after 10s
    }

    return newOrder;
  }
};
