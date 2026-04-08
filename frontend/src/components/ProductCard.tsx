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
    <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex gap-5 p-5">
        {/* Image - Material Design 3 */}
        <div className="relative w-32 h-32 rounded-[20px] overflow-hidden flex-shrink-0 bg-gray-50 shadow-sm">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        {/* Content - Ultra Clean */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 tracking-tight">{name}</h3>
            {description && (
              <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">{description}</p>
            )}
          </div>
          
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                {price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 ml-1.5">so'm</span>
            </div>
            
            <button
              onClick={onAddToCart}
              disabled={loading}
              className="bg-[#FF6B35] hover:bg-[#FF5722] active:bg-[#E64A19] text-white px-6 py-3 rounded-[16px] font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30"
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
