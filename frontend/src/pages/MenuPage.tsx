import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store/cartStore';

const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const { addToCart } = useCartStore();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const products = [
    { id: 1, name: 'Cheeseburger', price: 25000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category: 'burgers', description: 'Mol go\'shti, pishloq' },
    { id: 2, name: 'Chicken Burger', price: 23000, image: 'https://images.unsplash.com/photo-1615297928064-24977384d0f9?w=400', category: 'burgers', description: 'Tovuq go\'shti' },
    { id: 3, name: 'Pepperoni Pizza', price: 45000, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', category: 'pizza', description: 'Pepperoni, mozzarella' },
    { id: 4, name: 'Coca Cola', price: 8000, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', category: 'drinks', description: '330ml' },
    { id: 5, name: 'Ice Cream', price: 12000, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', category: 'desserts', description: 'Vanil, shokolad' },
  ];

  const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);

  const handleAddToCart = (product: typeof products[0]) => {
    setLoadingId(product.id);
    addToCart({ ...product, quantity: 1 });
    setTimeout(() => setLoadingId(null), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Menyu" showCart={true} />
      <div className="p-4">
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={() => handleAddToCart(product)}
              loading={loadingId === product.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
