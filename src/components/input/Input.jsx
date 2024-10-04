import { debounce } from "lodash";
import { icons } from "assets/icons/icons";
import { useCallback, useEffect, useState } from "react";
import { REFACTOR_SUM } from "assets/constants/constants";
import MUIMenu from "components/mui-menu/MUIMenu";
import ReactInputMask from "react-input-mask";
import Loader from "components/loader/Loader";

function Input({
  id = "input",
  type = "text",
  mask,
  label,
  value = "",
  loader = false,
  onBlur = () => {},
  onFocus = () => {},
  disabled = false,
  onChange = () => {},
  clearable = false,
  themeMode = "",
  inputMode,
  adornment,
  className = "",
  maxLength,
  numberMask = false,
  placeholder,
  sendRequest = false,
  selectValue,
  errorMessage,
  selectOptions = [],
  classNameInput = "text-sm",
  onChangeSelect = () => {},
  actionButtonLabel,
  actionButtonClick = () => {},
  selectOptionsLabel = { label: "label", value: "value" },
  actionButtonDisabled = false,
  classNameActionButton = "",
  classNameErrorMessage = "",
  classNameInputContainer = "",
}) {
  const [focus, setFocus] = useState(false);
  const [inputType, setInputType] = useState(type);
  const [inputValue, setInputValue] = useState(value);

  const handleFocus = (e) => {
    setFocus(true);
    onFocus(e);
  };
  const handleBlur = (e) => {
    setFocus(false);
    onBlur(e);
  };

  const changeWithDebounce = useCallback(
    debounce((e) => onChange(e), 700),
    []
  );

  const handleChangeInput = (e) => {
    // setInputValue(e.target.value);

    sendRequest
      ? changeWithDebounce(e)
      : onChange(
          numberMask ? { target: { value: e.target.value?.toString()?.replaceAll(" ", "") } } : e
        );
  };

  const handleClearInput = () => {
    // setInputValue("");
    onChange({ target: { value: "" } });
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => changeWithDebounce.cancel(), [changeWithDebounce, value]);

  return (
    <div className={`flex flex-col text-[13px] gap-1 relative ${themeMode} ${className}`}>
      <label htmlFor={id} className={`text-gray_dark dark:text-white`}>
        {label}
      </label>
      <div
        className={`bg-[#F9FBFF] relative w-full flex items-center rounded-lg border overflow-hidden dark:text-white dark:bg-green_9 ${classNameInputContainer}  ${
          focus
            ? "shadow-[0_0_0_2px_rgba(135,192,231,1)] dark:shadow-[0_0_0_2px_rgba(135,192,231,1)] border-gray_lighter dark:border-green_8"
            : errorMessage
            ? "border-red text-red"
            : "border-gray_lighter dark:border-green_8"
        }`}
      >
        <div className={`flex gap-1 absolute  ${loader ? "right-3" : "right-1"}`}>
          {clearable && inputValue && (
            <button onClick={handleClearInput} className="bg-[#F9FBFF] dark:bg-green_9 p-2">
              <icons.close className="stroke-black dark:stroke-white w-3" />
            </button>
          )}

          {type === "password" && (
            <button
              onClick={() => setInputType(inputType === "password" ? "text" : "password")}
              className=" outline-none pr-1"
            >
              {inputType === "password" ? (
                <icons.eye className="w-5 fill-black dark:fill-white" />
              ) : (
                <icons.eyeOff className="w-5 fill-black dark:fill-white" />
              )}
            </button>
          )}

          {actionButtonLabel &&
            (loader ? (
              <Loader className="w-[1.5rem] h-[1.5rem]" />
            ) : (
              <button
                onClick={actionButtonClick}
                disabled={disabled || actionButtonDisabled}
                className={`bg-blue px-4 py-[0.35rem] rounded-md text-white ${classNameActionButton} ${
                  actionButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onPointerDown={(e) => !disabled && handleFocus(e)}
              >
                {actionButtonLabel}
              </button>
            ))}
        </div>

        {selectOptions.length ? (
          <MUIMenu
            id={`${id}-select`}
            value={selectValue || ""}
            options={selectOptions}
            disabled={disabled}
            onChange={(e) => onChangeSelect({ target: { value: e } })}
            classNameList="max-w-max"
            focusableSelect={false}
            classNameButton="!w-[6rem] lg:!w-auto border-t-0 border-b-0 border-l-0 border-r !rounded-none"
          />
        ) : (
          // <select
          //   value={selectValue || ""}
          //   onBlur={handleBlur}
          //   onFocus={handleFocus}
          //   onChange={onChangeSelect}
          //   style={{ backgroundPosition: "0.5rem" }}
          //   disabled={disabled}
          //   className="outline-none p-2 pl-6 border-r border-gray_lighter dark:border-green_8 bg-transparent bg-no-repeat bg-arrow-down-black dark:bg-arrow-down-white  "
          // >
          //   {selectOptions.map((option) => (
          //     <option
          //       key={option?.[selectOptionsLabel?.value]}
          //       value={option?.[selectOptionsLabel?.value]}
          //       className="dark:bg-green_9 py-2"
          //     >
          //       {option?.[selectOptionsLabel?.label]}
          //     </option>
          //   ))}
          // </select>
          ""
        )}

        {adornment}

        <ReactInputMask
          id={id}
          mask={mask}
          maxLength={maxLength}
          type={numberMask ? "text" : inputType}
          value={
            numberMask
              ? REFACTOR_SUM(inputValue?.toString()?.replaceAll(" ", ""), " ") || ""
              : inputValue || ""
          }
          onBlur={handleBlur}
          disabled={disabled}
          onFocus={handleFocus}
          onChange={handleChangeInput}
          inputMode={inputMode}
          className={`w-full p-2 outline-none bg-transparent ${
            type === "password" ? "pr-9" : ""
          } ${classNameInput}`}
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>

      {!focus && (
        <span
          className={`text-red text-[10px] absolute bottom-[-17px] left-1 capitalize ${classNameErrorMessage}`}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}

export default Input;
