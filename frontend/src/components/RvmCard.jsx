import { Pencil, Trash2, Phone } from "lucide-react";

const RvmCard = ({ data, onEdit, onDelete }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold flex items-center gap-1">
          <Phone className="text-red-500 w-4 h-4" />
          {data.phone_number}
        </h2>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
            <Pencil size={18} />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:text-red-800">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Forwarding:</span> {data.forwarding_number}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Team ID:</span> {data.team_id}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Brand ID:</span> {data.brand_id}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Foreign ID:</span> {data.foreign_id}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Recording ID:</span> {data.recording_id}
      </p>
      {data.createdAt && (
        <p className="text-xs text-gray-400 mt-2">
          Created: {new Date(data.createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default RvmCard;
