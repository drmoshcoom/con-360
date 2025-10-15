
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { Button, Card, Modal } from '../components/ui';

const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        const data = await api.getAdminOrders();
        setOrders(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleViewProof = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleConfirmPayment = async (orderId: string) => {
        await api.confirmBankTransfer(orderId);
        await fetchOrders(); // Refresh orders list
        setIsModalOpen(false);
    };

    const getStatusColor = (status: OrderStatus) => {
        switch(status) {
            case OrderStatus.COMPLETED: return 'bg-green-500 text-green-900';
            case OrderStatus.PENDING_CONFIRMATION: return 'bg-yellow-500 text-yellow-900';
            case OrderStatus.PENDING_PAYMENT: return 'bg-blue-500 text-blue-900';
            case OrderStatus.FAILED: return 'bg-red-500 text-red-900';
            default: return 'bg-gray-500 text-gray-900';
        }
    }

    if (loading) return <div>جاري تحميل الطلبات...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">إدارة الطلبات</h2>
            <Card className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-surface border-b border-border">
                        <tr>
                            <th className="p-3 text-sm font-semibold tracking-wide">رقم الطلب</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">التاريخ</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">الإجمالي</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">طريقة الدفع</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">الحالة</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-background">
                                <td className="p-3 text-sm text-text-primary whitespace-nowrap">{order.id}</td>
                                <td className="p-3 text-sm text-text-secondary whitespace-nowrap">{order.createdAt.toLocaleDateString('ar-EG')}</td>
                                <td className="p-3 text-sm text-text-primary font-bold whitespace-nowrap">${order.total.toFixed(2)}</td>
                                <td className="p-3 text-sm text-text-secondary whitespace-nowrap">{order.paymentMethod}</td>
                                <td className="p-3 text-sm whitespace-nowrap">
                                    <span className={`p-1.5 text-xs font-medium uppercase tracking-wider rounded-lg ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-3 text-sm whitespace-nowrap">
                                    {order.status === OrderStatus.PENDING_CONFIRMATION && (
                                        <Button size="sm" variant="secondary" onClick={() => handleViewProof(order)}>مراجعة الإثبات</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="مراجعة إثبات الدفع">
                {selectedOrder && (
                    <div>
                        <p className="mb-4">طلب رقم: <span className="font-bold">{selectedOrder.id}</span></p>
                        <img src={selectedOrder.proofOfPaymentUrl} alt="Proof of payment" className="w-full h-auto rounded-md mb-6 border border-border"/>
                        <div className="flex justify-end space-x-2 space-x-reverse">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>إغلاق</Button>
                            <Button onClick={() => handleConfirmPayment(selectedOrder.id)}>تأكيد الدفع</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const AdminProductsPage: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">إدارة المنتجات</h2>
            <Card className="p-6 text-center text-text-secondary">
                <p>هذه الميزة قيد التطوير. هنا يمكنك إضافة وتعديل وحذف المنتجات.</p>
                <Button className="mt-4">إضافة منتج جديد</Button>
            </Card>
        </div>
    );
};

// Admin Layout and Router
const Admin: React.FC = () => {
    const { user, isAuthenticated } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        if (!isAuthenticated || !user?.isAdmin) {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    if (!user?.isAdmin) return null; // or a loading/access denied component

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4 lg:w-1/5">
                <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>
                <Card className="p-2">
                    <nav className="flex flex-col space-y-1">
                        <button onClick={() => setActiveTab('orders')} className={`w-full text-right p-3 rounded-md transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-surface'}`}>
                            الطلبات
                        </button>
                        <button onClick={() => setActiveTab('products')} className={`w-full text-right p-3 rounded-md transition-colors ${activeTab === 'products' ? 'bg-primary text-white' : 'hover:bg-surface'}`}>
                            المنتجات
                        </button>
                    </nav>
                </Card>
            </aside>
            <main className="flex-grow">
                {activeTab === 'orders' && <AdminOrdersPage />}
                {activeTab === 'products' && <AdminProductsPage />}
            </main>
        </div>
    );
};

export default Admin;
