
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { Button, Card } from './ui';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useAppContext();

  return (
    <Card className="flex flex-col h-full group">
      <Link to={`/product/${product.id}`} className="block">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity" />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs text-primary font-semibold mb-1">{product.type}</span>
        <h3 className="text-lg font-bold text-text-primary mb-2 flex-grow">
          <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">{product.name}</Link>
        </h3>
        <p className="text-sm text-text-secondary mb-4">بواسطة {product.seller}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-text-primary">${product.price.toFixed(2)}</span>
          <Button onClick={() => addToCart(product)}>أضف للسلة</Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
