// components/ServiceDropdown.jsx
const ServiceDropdown = ({ value, onChange }) => {
  return (
    <div className="w-full max-w-xs">
      <label
        htmlFor="service-select"
        className="block mb-1 text-sm font-medium text-indigo-600"
      >
        Choose Service:
      </label>
      <select
        id="service-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          px-4
          py-2.5
          rounded-md
          bg-white
          text-gray-800
          border border-indigo-500
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-400
          hover:border-indigo-600
          transition
        "
      >
        <option value="rvm">Cowboy RVM</option>
        <option value="vicidial">Vicidial</option>
        <option value="mautic">Mautic</option>
      </select>
    </div>
  );
};

export default ServiceDropdown;
