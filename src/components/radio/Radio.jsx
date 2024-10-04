function Radio({ label, value, selected, onSelect = () => {} }) {
  return (
    <div
      onClick={() => onSelect(value)}
      className="flex items-center gap-3 text-sm dark:text-white cursor-pointer"
    >
      <div className="w-5 h-5 bg-gray_light border border-gray_lighter rounded-full flex justify-center items-center dark:bg-[#1F323C] dark:border-[#4A7186]">
        {selected && <div className="w-3 h-3 bg-blue rounded-full" />}
      </div>
      <span>{label}</span>
    </div>
  );
}

export default Radio;
