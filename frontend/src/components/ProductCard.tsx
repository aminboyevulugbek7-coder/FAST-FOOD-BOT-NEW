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
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-lg transition-all duration-200 group">
      <div className="flex gap-4 p-4">
        {/* Image - Clean */}
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Content - Minimalist */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{name}</h3>
            {description && (
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">{description}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xl font-bold text-gray-900">
                {price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 ml-1">so'm</span>
            </div>
            
            <button
              onClick={onAddToCart}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? '...' : "+ Qo'shish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
