// components/TimeRangeDropdown.jsx
const TimeRangeDropdown = ({ value, onChange }) => {
  return (
    <div className="w-full max-w-xs">
      <label
        htmlFor="time-range"
        className="block mb-1 text-sm font-medium text-indigo-600"
      >
        Time Range:
      </label>
      <select
        id="time-range"
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
        <option value="15m">15 minutes</option>
        <option value="1h">1 hour</option>
        <option value="1d">1 day</option>
        <option value="1w">1 week</option>
        <option value="1mo">1 month</option>
      </select>
    </div>
  );
};

export default TimeRangeDropdown;
