import { icons } from "assets/icons/icons";

function Checkbox({
  checked = false,
  label,
  labelPosition = "right",
  onChange = () => {},
  classNameCheckbox = "",
  className = "",
}) {
  const handleChecked = () => onChange(!checked);

  return (
    <div
      onClick={handleChecked}
      className={`flex items-center gap-2 cursor-pointer text-sm dark:text-white ${
        labelPosition === "right" ? "" : "flex-row-reverse"
      } ${className}`}
    >
      <div
        className={`w-5 h-5 border rounded flex items-center justify-center ${
          checked ? "border-blue bg-blue" : "border-gray_lighter"
        } ${classNameCheckbox}`}
      >
        {checked && <icons.check className="fill-white w-3" />}
      </div>
      <span>{label}</span>
    </div>
  );
}

export default Checkbox;
