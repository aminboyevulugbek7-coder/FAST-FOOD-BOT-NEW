import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

interface HeaderProps {
  title: string;
  showCart?: boolean;
}

const Header = ({ title, showCart = false }: HeaderProps) => {
  const navigate = useNavigate();
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        {showCart && (
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
