interface CategoryCardProps {
  name: string;
  image: string;
  path: string;
}

const CategoryCard = ({ name, image, path }: CategoryCardProps) => {
  return (
    <button
      onClick={() => window.location.href = path}
      className="relative bg-white rounded-[24px] overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl group border border-gray-100 hover:border-[#FF6B35]/20"
    >
      {/* Image Background with Overlay */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>
      
      {/* Category Name */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-bold text-white text-lg tracking-tight drop-shadow-lg">
          {name}
        </h3>
      </div>
    </button>
  );
};

export default CategoryCard;
