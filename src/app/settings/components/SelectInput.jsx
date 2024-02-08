const SelectInput = ({
  options,
  label,
  title,
  onChange,
  defaultValue,
  disabled = false,
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <label
        forhtml={title}
        className="block text-sm font-medium leading-6 to-gray-900"
      >
        {label}
      </label>
      <select
        id={title}
        onChange={onChange}
        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
        value={defaultValue}
        disabled={disabled}
      >
        <option value="">{title}</option>
        {options.map((option) => (
          <option key={option.title} value={option.value}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
