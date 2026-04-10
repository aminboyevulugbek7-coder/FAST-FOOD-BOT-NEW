import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store/cartStore';

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

const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const { addToCart } = useCartStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const params: any = {
        page: 1,
        limit: 50,
        isActive: true,
        inStock: true
      };
      
      if (category !== 'all') {
        params.categoryId = category;
      }

      const response = await axios.get(`${apiUrl}/products`, { params });
      setProducts(response.data.products || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to default products if API fails
      const defaultProducts = [
        { id: '1', name: 'Cheeseburger', price: 25000, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', categoryId: 'burgers', description: 'Mol go\'shti, pishloq', isActive: true, inStock: true },
        { id: '2', name: 'Chicken Burger', price: 23000, imageUrl: 'https://images.unsplash.com/photo-1615297928064-24977384d0f9?w=400', categoryId: 'burgers', description: 'Tovuq go\'shti', isActive: true, inStock: true },
        { id: '3', name: 'Pepperoni Pizza', price: 45000, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', categoryId: 'pizza', description: 'Pepperoni, mozzarella', isActive: true, inStock: true },
        { id: '4', name: 'Coca Cola', price: 8000, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', categoryId: 'drinks', description: '330ml', isActive: true, inStock: true },
        { id: '5', name: 'Ice Cream', price: 12000, imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', categoryId: 'desserts', description: 'Vanil, shokolad', isActive: true, inStock: true },
      ];
      
      const filtered = category === 'all' ? defaultProducts : defaultProducts.filter(p => p.categoryId === category);
      setProducts(filtered);
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    setLoadingId(product.id);
    addToCart({ 
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      category: product.categoryId,
      description: product.description,
      quantity: 1 
    });
    setTimeout(() => setLoadingId(null), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Menyu" showCart={true} />
      <div className="p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[24px] overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mahsulotlar topilmadi</h3>
            <p className="text-gray-600">Bu kategoriyada hozircha mahsulotlar yo'q</p>
          </div>
        ) : (
          <div className="space-y-4">
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
                loading={loadingId === product.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
