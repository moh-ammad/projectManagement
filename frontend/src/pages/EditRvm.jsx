import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { showError } from "../libs/helper";
import RvmForm from "../components/RvmForm";

const EditRvm = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/api/rvm/${id}`);
        setInitialData(res.data);
      } catch (err) {
        console.error(err);
        showError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSuccess = () => {
    navigate("/services");
  };

  if (loading) {
    return <p className="text-gray-500 text-center mt-20">Loading...</p>;
  }

  if (!initialData) {
    return <p className="text-red-500 text-center mt-20">Data not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-4">Edit RVM Payload</h2>
      <RvmForm initialData={initialData} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditRvm;
