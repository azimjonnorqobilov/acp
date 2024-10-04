function ButtonsGroup({
  label,
  active,
  buttons,
  onClick = () => {},
  className,
  classNameLabel,
  classNameGroup = "w-max rounded-lg",
  classNameButton = "py-2 px-4 rounded-lg",
}) {
  return (
    <div className={`w-full flex flex-col gap-1 text-xs  ${className}`}>
      {label && <p className={`text-gray_dark dark:text-white ${classNameLabel}`}>{label}</p>}
      <div
        style={{ gridTemplateColumns: `repeat(${buttons?.length}, 1fr)` }}
        className={`grid bg-[#F9FBFF] p-[0.2rem] border border-gray_lighter dark:border-[#3E6277] dark:bg-[#1A313E] ${classNameGroup}`}
      >
        {buttons?.map((btn) => (
          <button
            key={btn?.value}
            onClick={() => onClick(btn?.value)}
            className={`w-full uppercase text-sm transition ${classNameButton} ${
              active === btn?.value ? "bg-blue text-white" : "text-black dark:text-white"
            }`}
          >
            {btn?.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ButtonsGroup;
