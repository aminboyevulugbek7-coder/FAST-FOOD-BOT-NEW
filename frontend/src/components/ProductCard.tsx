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
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        <img 
          src={image} 
          alt={name}
          className="w-32 h-32 object-cover"
        />
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 mb-1">{name}</h3>
            {description && (
              <p className="text-sm text-gray-500 mb-2">{description}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary-600">
              {price.toLocaleString()} so'm
            </span>
            <button
              onClick={onAddToCart}
              disabled={loading}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : "Qo'shish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
