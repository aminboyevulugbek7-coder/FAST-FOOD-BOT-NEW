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
    <div className="min-h-screen bg-white pb-32">
      <Header title={greeting} showCart={true} />
      
      {/* Hero Section - Ultra Clean */}
      <div className="px-6 pt-10 pb-8">
        <h1 className="text-[2.75rem] font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
          Tezkor yetkazib<br />berish
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-md">
          Eng mazali fast food 30 daqiqada eshigingizda
        </p>
      </div>

      {/* Categories - Material Design 3 */}
      <div className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Kategoriyalar</h2>
        <div className="grid grid-cols-2 gap-5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(category.path)}
              className="bg-[#FAFAFA] hover:bg-[#F5F5F5] active:bg-[#EEEEEE] rounded-[24px] p-7 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <div className="text-6xl mb-4 transform group-hover:scale-105 transition-transform duration-200">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-base tracking-tight">{category.name}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products - Clean */}
      <div className="px-6 mb-28">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Ommabop</h2>
        <FeaturedProducts />
      </div>

      {/* CTA Button - Material Design 3 */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-6 bg-white/95 backdrop-blur-sm border-t border-gray-100">
        <button
          onClick={() => navigate('/menu')}
          className="w-full bg-[#FF6B35] hover:bg-[#FF5722] active:bg-[#E64A19] text-white py-5 rounded-[20px] font-bold text-lg transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30"
        >
          Buyurtma berish
        </button>
      </div>
    </div>
  );
};

export default HomePage;
