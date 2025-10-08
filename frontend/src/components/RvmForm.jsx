import { useEffect, useState } from "react";
import axios from "axios";
import { showError, showSuccess } from "../libs/helper";

const initialPayload = {
  team_id: "",
  secret: "",
  brand_id: "",
  recording_id: "",
  phone_number: "",
  forwarding_number: "",
  foreign_id: "",
};

const RvmForm = ({ initialData = null, onSuccess }) => {
  const [formData, setFormData] = useState(initialPayload);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      const {
        team_id,
        secret,
        brand_id,
        recording_id,
        phone_number,
        forwarding_number,
        foreign_id,
      } = initialData;
      setFormData({
        team_id,
        secret,
        brand_id,
        recording_id,
        phone_number,
        forwarding_number,
        foreign_id,
      });
    } else {
      setFormData(initialPayload);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (initialData && initialData._id) {
        await axios.put(`/api/rvm/${initialData._id}`, formData);
        showSuccess("Updated successfully");
      } else {
        await axios.post(`/api/rvm`, formData);
        showSuccess("Created successfully");
      }
      onSuccess?.();
    } catch (err) {
      console.error(err);
      showError("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label
              htmlFor={key}
              className="mb-1 font-medium text-gray-700 capitalize"
            >
              {key.replace(/_/g, " ")}
            </label>
            <input
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className={`px-6 py-2 rounded text-white ${
            submitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          } transition`}
        >
          {submitting
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
            ? "Update"
            : "Create"}
        </button>
      </div>
    </form>
  );
};

export default RvmForm;
