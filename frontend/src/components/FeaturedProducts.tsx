import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  description: string;
  isActive: boolean;
  inStock: boolean;
}

const FeaturedProducts = () => {
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/products`, {
        params: {
          page: 1,
          limit: 6,
          isActive: true,
          inStock: true
        }
      });
      setProducts(response.data.products || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to default products if API fails
      setProducts([
        {
          id: '1',
          name: 'Cheeseburger Deluxe',
          price: 25000,
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
          categoryId: 'burgers',
          description: 'Mol go\'shti, pishloq, sabzavotlar',
          isActive: true,
          inStock: true
        },
        {
          id: '2',
          name: 'Pepperoni Pitsa',
          price: 45000,
          imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
          categoryId: 'pizza',
          description: 'Pepperoni, mozzarella, sous',
          isActive: true,
          inStock: true
        },
        {
          id: '3',
          name: 'Chicken Burger',
          price: 23000,
          imageUrl: 'https://images.unsplash.com/photo-1615297928064-24977384d0f9?w=400',
          categoryId: 'burgers',
          description: 'Tovuq go\'shti, maxsus sous',
          isActive: true,
          inStock: true
        }
      ]);
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    setAddingToCart(true);
    addToCart({ 
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      category: product.categoryId,
      description: product.description,
      quantity: 1 
    });
    setTimeout(() => setAddingToCart(false), 500);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-[24px] overflow-hidden shadow-md animate-pulse">
            <div className="h-40 bg-gray-200"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={Number(product.id)}
          name={product.name}
          price={product.price}
          image={product.imageUrl}
          category={product.categoryId}
          description={product.description}
          onAddToCart={() => handleAddToCart(product)}
          loading={addingToCart}
        />
      ))}
    </div>
  );
};

export default FeaturedProducts;
