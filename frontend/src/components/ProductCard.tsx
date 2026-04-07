interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  onAddToCart: () => void;
  loading?: boolean;
}

const ProductCard = ({ 
  name, 
  price, 
  image, 
  description,
  onAddToCart,
  loading = false 
}: ProductCardProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="flex">
        {/* Image with overlay */}
        <div className="relative w-36 h-36 overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1.5 line-clamp-1">{name}</h3>
            {description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Narxi</span>
              <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                {price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 font-medium">so'm</span>
            </div>
            
            <button
              onClick={onAddToCart}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <span>🛒</span>
                  <span>Qo'shish</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
