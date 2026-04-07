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
      className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-white`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-bold text-lg">{name}</h3>
    </button>
  );
};

export default CategoryCard;
