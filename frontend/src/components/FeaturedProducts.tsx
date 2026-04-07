import { useState } from 'react';
import { useCartStore, CartItem } from '../store/cartStore';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const { addToCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const products = [
    {
      id: 1,
      name: 'Cheeseburger Deluxe',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      category: 'burgers',
      description: 'Mol go\'shti, pishloq, sabzavotlar'
    },
    {
      id: 2,
      name: 'Pepperoni Pitsa',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
      category: 'pizza',
      description: 'Pepperoni, mozzarella, sous'
    },
    {
      id: 3,
      name: 'Chicken Burger',
      price: 23000,
      image: 'https://images.unsplash.com/photo-1615297928064-24977384d0f9?w=400',
      category: 'burgers',
      description: 'Tovuq go\'shti, maxsus sous'
    }
  ];

  const handleAddToCart = (product: typeof products[0]) => {
    setLoading(true);
    addToCart(product as CartItem);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Ommabop Mahsulotlar</h3>
      <div className="space-y-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={() => handleAddToCart(product)}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
