interface CategoryCardProps {
  name: string;
  icon: string;
  color: string;
  path: string;
}

const CategoryCard = ({ name, icon, color, path }: CategoryCardProps) => {
  return (
    <button
      onClick={() => window.location.href = path}
      className={`relative bg-gradient-to-br ${color} p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-[1.05] active:scale-[0.98] transition-all duration-200 text-white overflow-hidden group`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-200">{icon}</div>
        <h3 className="font-bold text-xl drop-shadow-md">{name}</h3>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
    </button>
  );
};

export default CategoryCard;
