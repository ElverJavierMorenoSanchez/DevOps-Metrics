const SelectForm = ({
  options,
  label,
  title,
  onChange,
  defaultValue,
  disabled = false,
}) => {
  return (
    <div className="flex flex-row items-center gap-3">
      <label
        forhtml={title}
        className="flex items-center justify-end w-40 h-full text-end text-md font-semibold text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select
        id={title}
        onChange={onChange}
        className="w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

export default SelectForm;
