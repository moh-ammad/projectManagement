import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showError, showSuccess } from "../libs/helper";

import ServiceDropdown from "../components/ServiceDropdown";
import TimeRangeDropdown from "../components/TimeRangeDropdown"; // NEW
import RvmCard from "../components/RvmCard";
import { Plus } from "lucide-react";

const Services = () => {
  const [service, setService] = useState("rvm");
  const [timeRange, setTimeRange] = useState("1d"); // Default time
  const [rvmPayloads, setRvmPayloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPayloads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/rvm`); // Optionally add timeRange as query param
      setRvmPayloads(res.data);
    } catch (err) {
      console.error(err);
      showError("Failed to fetch RVM payloads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (service === "rvm") {
      fetchPayloads();
    }
  }, [service]);

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Services</h1>
          <p className="text-gray-600">
            Use these services to interact with your users:
            <br />
            <span className="text-blue-600 font-semibold">Cowboy RVM</span> (Voicemail),{" "}
            <span className="text-green-600 font-semibold">Vicidial</span> (Calling),{" "}
            <span className="text-purple-600 font-semibold">Mautic</span> (Email)
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

      {/* Service Content */}
      {service === "rvm" && (
        <div className="mt-8">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : rvmPayloads.length === 0 ? (
            <p className="text-gray-500">No payloads found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rvmPayloads.map((payload) => (
                <RvmCard
                  key={payload._id}
                  data={payload}
                  onEdit={() => navigate(`/services/edit/${payload._id}`)}
                  onDelete={() => handleDelete(payload._id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Placeholder for other services */}
      {service === "vicidial" && (
        <div className="text-center mt-16">
          <img src="/vicidial.avif" alt="Vicidial" className="mx-auto w-32 opacity-80 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Vicidial Coming Soon</h2>
        </div>
      )}
      {service === "mautic" && (
        <div className="text-center mt-16">
          <img src="/mautic.png" alt="Mautic" className="mx-auto w-32 opacity-80 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Mautic Coming Soon</h2>
        </div>
      )}
    </div>
  );
};

export default Services;
