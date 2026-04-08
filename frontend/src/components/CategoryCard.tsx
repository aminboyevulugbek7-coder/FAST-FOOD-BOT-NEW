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
      className="bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-3xl p-8 transition-all duration-200 border border-gray-100 hover:border-orange-200 group"
    >
      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
    </button>
  );
};

export default CategoryCard;
