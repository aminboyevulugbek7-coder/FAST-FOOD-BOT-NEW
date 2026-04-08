import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
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
    { 
      id: 1, 
      name: 'Burgerlar', 
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
      path: '/menu?category=burgers' 
    },
    { 
      id: 2, 
      name: 'Pitsa', 
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
      path: '/menu?category=pizza' 
    },
    { 
      id: 3, 
      name: 'Ichimliklar', 
      image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop',
      path: '/menu?category=drinks' 
    },
    { 
      id: 4, 
      name: 'Shirinliklar', 
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
      path: '/menu?category=desserts' 
    },
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

      {/* Categories - Material Design 3 with Photorealistic Images */}
      <div className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Kategoriyalar</h2>
        <div className="grid grid-cols-2 gap-5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(category.path)}
              className="relative bg-white rounded-[24px] overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl group border border-gray-100 hover:border-[#FF6B35]/20"
            >
              {/* Image Background with Overlay */}
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
              
              {/* Category Name */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-bold text-white text-lg tracking-tight drop-shadow-lg">
                  {category.name}
                </h3>
              </div>
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
