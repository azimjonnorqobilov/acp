import { useRef, useState } from "react";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";

function UploadFile({
  id = "upload-file",
  label,
  className,
  themeMode,
  placeholder,
  onChange = () => {},
}) {
  const { t } = useTranslation();
  const inputRef = useRef();
  const [focus, setFocus] = useState(false);
  const [inputValue, setInputValue] = useState(null);

  const handleChangeInput = (e) => {
    setInputValue(e?.target?.files?.[0]);
    onChange(e);
  };

  const handleClearInput = () => {
    setInputValue(null);
    onChange("");
    inputRef.current.value = "";
  };

  return (
    <div className={`flex flex-col text-sm gap-1 ${themeMode} ${className}`}>
      <label htmlFor={id} className={`text-gray_dark dark:text-white`}>
        {label}
      </label>
      <div
        className={`text-sm pl-2 p-[0.1rem] relative w-full flex items-center justify-between rounded-lg border border-gray_lighter overflow-hidden dark:text-white dark:bg-green_9 dark:border-green_8 ${
          focus
            ? "shadow-[0_0_0_2px_rgba(135,192,231,1)] dark:shadow-[0_0_0_2px_rgba(135,192,231,1)]"
            : ""
        }`}
      >
        <input
          id={id}
          ref={inputRef}
          type="file"
          onBlur={() => setFocus(false)}
          onFocus={() => setFocus(true)}
          className="hidden"
          onChange={handleChangeInput}
        />
        <p className={` ${inputValue?.name ? "" : "text-gray_placeholder"}`}>
          {inputValue?.name || placeholder}
        </p>
        <div className="flex items-center gap-2">
          {inputValue?.name && (
            <button onClick={handleClearInput} className="bg-inherit p-1">
              <icons.close className="stroke-black dark:stroke-white w-3" />
            </button>
          )}
          <label
            htmlFor={id}
            className="bg-blue text-white px-4 py-[0.4rem] rounded-md flex items-center gap-2 text-sm cursor-pointer"
          >
            <icons.folder className="fill-white w-4" />
            <span>{t("select-file")}</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default UploadFile;
