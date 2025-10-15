// Fix: Create the pages/Store.tsx file with all necessary components and logic.
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/api';
import { useAppContext } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import { Button, Card, Input } from '../components/ui';
import HeroBanner from '../components/HeroBanner';

// --- Components for different views ---

const ProductGrid: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { searchTerm } = useAppContext();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-10">جاري تحميل المنتجات...</div>;

    return (
        <div>
            <HeroBanner />
            <h1 id="products-grid" className="text-3xl font-bold mb-6 pt-4">المتجر</h1>
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-lg text-text-secondary">لا توجد منتجات تطابق بحثك.</p>
                </div>
            )}
        </div>
    );
};


const ProductDetails: React.FC<{ id: string }> = ({ id }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const data = await api.getProductById(id);
            if (data) {
                setProduct(data);
            } else {
                navigate('/');
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id, navigate]);

    if (loading) return <div className="text-center py-10">جاري تحميل المنتج...</div>;
    if (!product) return null;

    return (
        <div>
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
                &larr; العودة للمتجر
            </Button>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <Card className="overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover" />
                </Card>
                <div className="flex flex-col">
                    <span className="text-sm text-primary font-semibold mb-2">{product.type}</span>
                    <h1 className="text-4xl font-extrabold text-text-primary mb-3">{product.name}</h1>
                    <p className="text-lg text-text-secondary mb-4">بواسطة {product.seller}</p>
                    <p className="text-text-primary mb-6 flex-grow">{product.description}</p>
                    <div className="flex justify-between items-center bg-surface p-4 rounded-lg border border-border mt-auto">
                        <span className="text-3xl font-bold text-text-primary">${product.price.toFixed(2)}</span>
                        <Button onClick={() => addToCart(product)}>أضف للسلة</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CartView: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useAppContext();
    const navigate = useNavigate();
    
    if (cart.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold mb-4">سلّة التسوق فارغة</h1>
                <p className="text-text-secondary mb-6">ليس لديك أي منتجات في السلة. هيا بنا نتسوق!</p>
                <Button onClick={() => navigate('/')}>العودة للمتجر</Button>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">سلة التسوق</h1>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map(item => (
                        <Card key={item.product.id} className="p-4 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-md" />
                                <div>
                                    <Link to={`/product/${item.product.id}`} className="font-bold text-text-primary hover:text-primary">{item.product.name}</Link>
                                    <p className="text-sm text-text-secondary">${item.product.price.toFixed(2)}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-2">
                                <Input 
                                    type="number" 
                                    value={item.quantity} 
                                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value, 10))}
                                    className="w-20 text-center"
                                    min="1"
                                />
                                <Button variant="danger" onClick={() => removeFromCart(item.product.id)}>إزالة</Button>
                            </div>
                        </Card>
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
                        <div className="flex justify-between mb-2 text-text-secondary">
                            <span>المجموع الفرعي</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-text-secondary mb-4">
                            <span>الضرائب والشحن</span>
                            <span>$0.00</span>
                        </div>
                        <hr className="border-border my-2"/>
                        <div className="flex justify-between font-bold text-lg mb-6">
                            <span>الإجمالي</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <Button className="w-full" onClick={() => navigate('/checkout')}>المتابعة للدفع</Button>
                        <Button variant="ghost" className="w-full mt-2" onClick={clearCart}>إفراغ السلة</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const CheckoutView: React.FC = () => {
    const { cart, cartTotal, clearCart, isAuthenticated } = useAppContext();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Bank Transfer'>('Credit Card');
    const [isProcessing, setIsProcessing] = useState(false);
    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate(`/login?redirect=/checkout`);
        } else if (cart.length === 0 && !isProcessing) {
            navigate('/');
        }
    }, [isAuthenticated, navigate, cart, isProcessing]);

    const handleCheckout = async () => {
        setIsProcessing(true);
        const order = await api.createOrder(cart, paymentMethod);
        if (order) {
            clearCart();
            alert(`تم إنشاء طلبك بنجاح! رقم الطلب: ${order.id}`);
            navigate('/account');
        } else {
             alert('حدث خطأ أثناء إنشاء طلبك. الرجاء المحاولة مرة أخرى.');
             setIsProcessing(false);
        }
    };
    
    if (!isAuthenticated || cart.length === 0) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">إتمام الشراء</h1>
            <Card className="p-8">
                <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
                <div className="space-y-2 mb-6">
                    {cart.map(item => (
                        <div key={item.product.id} className="flex justify-between">
                            <span className="text-text-secondary">{item.product.name} x {item.quantity}</span>
                            <span className="text-text-primary">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <hr className="border-border my-4"/>
                <div className="flex justify-between font-bold text-xl mb-6">
                    <span>الإجمالي للدفع:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <h2 className="text-xl font-bold mb-4">طريقة الدفع</h2>
                <div className="space-y-3 mb-8">
                   <p className="text-sm text-text-secondary">هذا نموذج دفع وهمي. لا تقم بإدخال معلومات حقيقية.</p>
                   <div>
                        <label className={`flex items-center p-3 border rounded-md cursor-pointer hover:bg-surface ${paymentMethod === 'Credit Card' ? 'border-primary bg-surface' : 'border-border'}`}>
                            <input type="radio" name="payment" className="form-radio text-primary focus:ring-primary" checked={paymentMethod === 'Credit Card'} onChange={() => setPaymentMethod('Credit Card')} />
                            <span className="mr-3">بطاقة ائتمان</span>
                        </label>
                   </div>
                    <div>
                        <label className={`flex items-center p-3 border rounded-md cursor-pointer hover:bg-surface ${paymentMethod === 'Bank Transfer' ? 'border-primary bg-surface' : 'border-border'}`}>
                            <input type="radio" name="payment" className="form-radio text-primary focus:ring-primary" checked={paymentMethod === 'Bank Transfer'} onChange={() => setPaymentMethod('Bank Transfer')} />
                            <span className="mr-3">تحويل بنكي</span>
                        </label>
                   </div>
                </div>

                <Button className="w-full" onClick={handleCheckout} disabled={isProcessing}>
                    {isProcessing ? 'جاري المعالجة...' : `ادفع ${cartTotal.toFixed(2)}$`}
                </Button>
            </Card>
        </div>
    );
};


// Main Store component that routes to the correct view
const Store: React.FC = () => {
    const { pathname } = useLocation();
    const { id } = useParams<{ id: string }>();

    if (id && pathname.startsWith('/product/')) {
        return <ProductDetails id={id} />;
    }
    if (pathname.startsWith('/cart')) {
        return <CartView />;
    }
    if (pathname.startsWith('/checkout')) {
        return <CheckoutView />;
    }
    return <ProductGrid />;
};

export default Store;