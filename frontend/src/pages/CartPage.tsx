import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCartStore } from '../store/cartStore';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCartStore();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Savat" showCart={false} />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Savat bo'sh</h2>
            <button
              onClick={() => navigate('/menu')}
              className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600"
            >
              Xarid qilish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      <Header title="Savat" showCart={false} />
      
      <div className="p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-md flex gap-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <p className="text-primary-600 font-semibold">{item.price.toLocaleString()} so'm</p>
              
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300"
                >
                  -
                </button>
                <span className="font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Jami:</span>
          <span className="text-2xl font-bold text-gray-800">
            {getTotalPrice().toLocaleString()} so'm
          </span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
        >
          Buyurtma berish
        </button>
      </div>
    </div>
  );
};

export default CartPage;
