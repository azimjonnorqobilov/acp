import { useState } from "react";
import { useTranslation } from "react-i18next";
import Radio from "./Radio";

function RadioGroup({
  options,
  value,
  onSelected = () => {},
  className = "flex flex-col gap-3",
  optionsLabel = { label: "label", value: "value" },
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(value);

  const handleSelected = (e) => {
    setSelected(e);
    onSelected(e);
  };

  return (
    <div className={className}>
      {options?.map((option, idx) => (
        <Radio
          key={idx}
          label={t(option?.[optionsLabel?.label])}
          value={option?.[optionsLabel?.value]}
          onSelect={handleSelected}
          selected={selected === option?.[optionsLabel?.value] ? true : false}
        />
      ))}
    </div>
  );
}

export default RadioGroup;
