import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import FeaturedProducts from '../components/FeaturedProducts';

const HomePage = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setGreeting(`Salom, ${user.first_name}!`);
      } else {
        setGreeting('Xush kelibsiz!');
      }
    }
  }, []);

  const categories = [
    { id: 1, name: 'Burgerlar', icon: '🍔', color: 'from-orange-400 to-red-500', path: '/menu?category=burgers' },
    { id: 2, name: 'Pitsa', icon: '🍕', color: 'from-yellow-400 to-orange-500', path: '/menu?category=pizza' },
    { id: 3, name: 'Ichimliklar', icon: '🥤', color: 'from-blue-400 to-cyan-500', path: '/menu?category=drinks' },
    { id: 4, name: 'Shirinliklar', icon: '🍦', color: 'from-pink-400 to-purple-500', path: '/menu?category=desserts' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-24">
      <Header title={greeting} showCart={true} />
      
      {/* Hero Section - Professional */}
      <div className="relative bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 text-white p-8 rounded-b-[2.5rem] shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-3 drop-shadow-lg">Tezkor yetkazib berish 🚀</h2>
          <p className="text-lg opacity-95 font-medium">Eng mazali fast food 30 daqiqada eshigingizda!</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm font-semibold">⚡ Tez</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm font-semibold">🎯 Sifatli</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm font-semibold">💰 Arzon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories - Professional */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-bold text-gray-800">Kategoriyalar</h3>
          <span className="text-sm text-gray-500 font-medium">Tanlang 👇</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* CTA Button - Professional */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={() => navigate('/menu')}
          className="w-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🍔</span>
          <span>Buyurtma berish</span>
          <span className="text-2xl">🚀</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
