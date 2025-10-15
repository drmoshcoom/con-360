import React, { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const UserIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);


const Header: React.FC = () => {
    const { isAuthenticated, user, logout, cartCount, searchTerm, setSearchTerm } = useAppContext();
    const navLinkClasses = "text-text-secondary hover:text-text-primary transition-colors";
    const activeNavLinkClasses = "text-primary font-semibold";

    return (
        <header className="bg-surface/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-2xl font-bold text-primary">متجري الرقمي</Link>
                        <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
                            <NavLink to="/" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses}>المتجر</NavLink>
                            {user?.isAdmin && <NavLink to="/admin" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses}>لوحة التحكم</NavLink>}
                        </nav>
                    </div>

                    <div className="flex-1 flex justify-center px-8">
                        <div className="relative w-full max-w-lg">
                             <input
                                type="text"
                                placeholder="ابحث عن منتج..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-background border border-border rounded-full px-4 py-2 pr-10 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-text-secondary">
                                <SearchIcon />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 space-x-reverse">
                        <Link to="/cart" className="relative text-text-secondary hover:text-text-primary">
                            <ShoppingCartIcon />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
                            )}
                        </Link>
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Link to="/account" className="text-text-secondary hover:text-text-primary"><UserIcon /></Link>
                                <button onClick={logout} className="text-sm text-text-secondary hover:text-red-500">خروج</button>
                            </div>
                        ) : (
                             <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary">تسجيل الدخول</Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};


const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-surface border-t border-border mt-auto">
                <div className="container mx-auto px-4 py-6 text-center text-text-secondary">
                    <p>&copy; {new Date().getFullYear()} متجري الرقمي. جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;