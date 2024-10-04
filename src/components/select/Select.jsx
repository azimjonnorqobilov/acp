function Select({
  id = "select",
  label,
  value,
  options = [],
  disabled = false,
  optionsLabel = { label: "label", value: "value" },
  themeMode,
  className,
  classNameSelect = `bg-arrow-down-black dark:bg-arrow-down-white bg-left bg-[center_left_0.75rem] ${themeMode}`,
  onChange = () => {},
}) {
  return (
    <div className={`flex flex-col text-sm gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={` ${
            themeMode
              ? themeMode === "dark"
                ? "text-white"
                : "text-gray_dark"
              : "text-gray_dark dark:text-white"
          }`}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        style={{ backgroundPosition: "0.5rem" }}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-2 pl-7 rounded-lg border border-gray_lighter bg-[#F9FBFF] focus:outline-none focus:shadow-[0_0_0_2px_rgba(135,192,231,1)] bg-no-repeat dark:text-white dark:bg-green_9 dark:border-green_8 ${classNameSelect} `}
      >
        {options?.map((option) => (
          <option key={option?.[optionsLabel?.value]} value={option?.[optionsLabel?.value]}>
            {option?.[optionsLabel?.label]}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
