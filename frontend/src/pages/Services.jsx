// src/pages/Services.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showError, showSuccess } from "../libs/helper";
import ServiceDropdown from "../components/ServiceDropdown";
import TimeRangeDropdown from "../components/TimeRangeDropdown";
import { Plus, Pencil, Trash2 } from "lucide-react";

const Services = () => {
  const [service, setService] = useState("rvm");
  const [timeRange, setTimeRange] = useState("1d");
  const [rvmPayloads, setRvmPayloads] = useState([]);
  const [filteredPayloads, setFilteredPayloads] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch all payloads
  const fetchPayloads = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/rvm/media");
      const data = res.data?.data || [];
      setRvmPayloads(data);
      filterByTimeRange(data, timeRange);
    } catch (err) {
      console.error(err);
      showError("Failed to fetch RVM payloads");
    } finally {
      setLoading(false);
    }
  };

  // Filter payloads by time range
  const filterByTimeRange = (data, range) => {
    const now = Date.now();
    const msMap = {
      "15m": 15 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "1d": 24 * 60 * 60 * 1000,
      "1w": 7 * 24 * 60 * 60 * 1000,
      "1mo": 30 * 24 * 60 * 60 * 1000,
    };

    const timeThreshold = now - msMap[range];
    const filtered = data.filter(item => Number(item.created_at) >= timeThreshold);

    // Sort by created_at descending
    filtered.sort((a, b) => b.created_at - a.created_at);

    setFilteredPayloads(filtered);
  };

  useEffect(() => {
    if (service === "rvm") {
      fetchPayloads();
    }
  }, [service]);

  useEffect(() => {
    filterByTimeRange(rvmPayloads, timeRange);
  }, [timeRange]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      await axios.delete(`/api/rvm/${id}`);
      showSuccess("Deleted successfully");
      fetchPayloads();
    } catch (err) {
      console.error(err);
      showError("Delete failed");
    }
  };

  const formatDate = (timestamp) => {
    const d = new Date(Number(timestamp));
    return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Services</h1>
          <p className="text-gray-600">
            Use these services to interact with your users:
            <br />
            <span className="text-blue-600 font-semibold">Cowboy RVM</span>,{" "}
            <span className="text-green-600 font-semibold">Vicidial</span>,{" "}
            <span className="text-purple-600 font-semibold">Mautic</span>
          </p>
        </div>
        <button
          onClick={() => navigate("/services/create")}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition"
        >
          <Plus />
        </button>
      </div>

      {/* Dropdowns */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <ServiceDropdown value={service} onChange={setService} />
        <TimeRangeDropdown value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Payload Table */}
      {service === "rvm" && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {loading ? (
            <p className="text-center text-gray-500 p-4">Loading...</p>
          ) : filteredPayloads.length === 0 ? (
            <p className="text-center text-gray-500 p-4">No payloads found.</p>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-indigo-600 text-white text-sm">
                <tr>
                  <th className="px-4 py-3">S.No</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayloads.map((payload, index) => (
                  <tr
                    key={payload.media_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(payload.created_at)}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-semibold">
                      {payload.name}
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button
                        onClick={() => navigate(`/services/edit/${payload.media_id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(payload.media_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Services;
