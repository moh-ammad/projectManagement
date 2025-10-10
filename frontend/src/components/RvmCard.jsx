// src/components/RvmCard.jsx
import { Pencil, Trash2 } from "lucide-react";

const RvmCard = ({ data, onEdit, onDelete }) => {
  const date = new Date(Number(data.created_at)).toLocaleDateString("en-GB");
  return (
    <div className="bg-white p-4 rounded-md shadow hover:shadow-lg transition">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-sm text-gray-500">{date}</p>
          <h3 className="text-lg font-semibold text-gray-800">{data.name}</h3>
        </div>
        <div className="flex space-x-3">
          <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
            <Pencil size={18} />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:text-red-800">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RvmCard;
