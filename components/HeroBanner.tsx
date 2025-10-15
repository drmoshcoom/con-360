import React from 'react';
import { Button } from './ui';

const HeroBanner: React.FC = () => {
    const scrollToProducts = () => {
        const productsSection = document.getElementById('products-grid');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative bg-gray-800 text-white rounded-lg overflow-hidden mb-8">
            <img 
                src="https://storage.googleapis.com/aai-web-samples/projects/loveable/clv087jcf0007m80p555461gw/clv6i3g2t0007m80s5e0037a3.png" 
                alt="بوابتك لعالم المنتجات الرقمية المتكاملة" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-10 flex flex-col items-center justify-end p-8 text-center h-[400px]">
                {/* Text elements are removed as they are now part of the background image */}
                <Button variant="secondary" className="px-8 py-3 text-lg" onClick={scrollToProducts}>
                    تصفح المنتجات الآن
                </Button>
            </div>
        </div>
    );
};

export default HeroBanner;
