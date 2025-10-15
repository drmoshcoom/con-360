
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Button, Card, Input } from '../components/ui';
import { api } from '../services/api';
import { Order } from '../types';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const user = await login(email, password);
        if (user) {
            navigate(redirectPath);
        } else {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <Card className="p-8">
                <h1 className="text-2xl font-bold text-center mb-6">تسجيل الدخول</h1>
                {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">كلمة المرور</label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"/>
                    </div>
                    <Button type="submit" className="w-full">دخول</Button>
                </form>
                <p className="text-sm text-center text-text-secondary mt-4">
                   ليس لديك حساب؟ <Link to="/register" className="text-primary hover:underline">أنشئ حساباً</Link>
                </p>
                 <div className="mt-4 text-center text-xs text-text-secondary">
                    <p>للإدارة: admin@example.com</p>
                    <p>للشراء: buyer@example.com</p>
                    <p>(أي كلمة مرور)</p>
                </div>
            </Card>
        </div>
    );
};

const AccountPage: React.FC = () => {
    const { user, isAuthenticated } = useAppContext();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            const userOrders = await api.getUserOrders();
            setOrders(userOrders);
            setLoading(false);
        };
        
        fetchOrders();
    }, [isAuthenticated, navigate]);

    if (loading) return <div>جاري تحميل الطلبات...</div>

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">حسابي</h1>
            <p className="text-text-secondary mb-8">مرحباً, {user?.email}. هنا يمكنك مشاهدة طلباتك السابقة وتنزيل مشترياتك.</p>
            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">طلباتي المكتملة</h2>
                <div className="space-y-4">
                    {orders.length > 0 ? orders.map(order => (
                        <div key={order.id} className="p-4 bg-background rounded-md border border-border flex justify-between items-center">
                           <div>
                                <p className="font-semibold">طلب رقم: {order.id}</p>
                                <p className="text-sm text-text-secondary">بتاريخ: {order.createdAt.toLocaleDateString('ar-EG')}</p>
                                <p className="text-sm text-text-secondary">الإجمالي: ${order.total.toFixed(2)}</p>
                           </div>
                           {order.downloadLink ? (
                               <Button onClick={() => alert('بدء التنزيل... (هذا رابط مؤقت صالح لـ24 ساعة)')}>تحميل الملفات</Button>
                           ): (
                               <span className="text-sm text-yellow-400">قيد المعالجة</span>
                           )}
                        </div>
                    )) : (
                        <p className="text-text-secondary">ليس لديك أي طلبات مكتملة بعد.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

// Main Auth component
const Auth: React.FC = () => {
    const { pathname } = window.location;

    if (pathname.includes('/login')) {
        return <LoginPage />;
    }
    if (pathname.includes('/account')) {
        return <AccountPage />;
    }
    // Mock registration page
    return (
        <div className="text-center py-20">
            <h1 className="text-3xl font-bold">إنشاء حساب</h1>
            <p className="text-text-secondary mt-4">هذه الميزة قيد الإنشاء.</p>
            <Button onClick={() => window.history.back()} className="mt-6">العودة</Button>
        </div>
    );
};

export default Auth;
