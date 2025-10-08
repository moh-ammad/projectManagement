import { useNavigate } from "react-router-dom";
import RvmForm from "../components/RvmForm";

const CreateRvm = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/services");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-4">Create RVM Payload</h2>
      <RvmForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CreateRvm;
