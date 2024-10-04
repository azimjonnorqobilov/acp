function Textarea({
  id,
  label,
  rows = 2,
  value,
  onChange,
  themeMode,
  className,
  cols = 100,
  placeholder,
  classNameTextarea,
  ...args
}) {
  return (
    <div className={`flex flex-col text-sm gap-1 ${themeMode} ${className}`}>
      <label htmlFor={id} className={`text-gray_dark dark:text-white`}>
        {label}
      </label>
      <textarea
        {...args}
        id={id}
        cols={cols}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`scrollbar-hidden w-full p-2 rounded-lg bg-[#F9FBFF] border border-gray_lighter focus:outline-none focus:shadow-[0_0_0_2px_rgba(135,192,231,1)] dark:text-white dark:bg-green_9 dark:border-green_8 dark:focus:shadow-[0_0_0_2px_rgba(135,192,231,1)] ${classNameTextarea}`}
      />
    </div>
  );
}

export default Textarea;
