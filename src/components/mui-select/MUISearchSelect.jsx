import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useAutocomplete } from "@mui/base";
import { icons } from "assets/icons/icons";

function MUISearchSelect({
  id,
  icon = "",
  value = "",
  label = "",
  options = [],
  onChange,
  onCreate,
  className = "",
  onSelected,
  placeholder = "",
  localFilter = false,
  errorMessage = "",
  createButton = false,
  classNameInput = "",
  classNameErrorMessage = "",
  optionsLabel = { label: "label", value: "value" },
}) {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(false);
  const [search, setSearch] = useState(value);
  const [selected, setSelected] = useState({});

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    open: open,
    options: options?.length ? options : [],
    blurOnSelect: true,
    // onOpen: () => {
    //   setOpen(true);
    //   setFocus(true);
    // },
    // onClose: () => {
    //   setOpen(false);
    //   setFocus(false);
    // },
    getOptionLabel: (option) => option?.[optionsLabel?.label],
  });

  const handleFocus = () => {
    setFocus(true);
    groupedOptions.length > 0 && setOpen(true);
  };
  const handleBlur = (e) => {
    setFocus(false);
    setOpen(false);
    !selected?.value && search && handleSelected(options?.[0]);
  };

  const handleChangeSearch = (e) => {
    setSearch(e?.target?.value);
    !localFilter && debouncedSearch(e);
    if (!e?.target?.value) {
      setOpen(false);
      onSelected("");
      setSelected({});
    } else setOpen(true);
  };

  const handleSelected = (option) => {
    setSearch(option?.[optionsLabel?.label]);
    onSelected(option?.[optionsLabel?.value]);
    setSelected(option);
    setOpen(false);
  };

  const handleClear = () => {
    setOpen(false);
    setSearch("");
    setSelected({});
    onSelected("");
  };

  const debouncedSearch = useCallback(
    debounce((e) => onChange(e), 512),
    []
  );

  // useEffect(() => {
  //   if (value) {
  //     const defaultSelected = options?.filter(
  //       (option) => option?.[optionsLabel?.value] === value
  //     )?.[0];
  //     setSelected(defaultSelected);
  //     setSearch(defaultSelected?.[optionsLabel?.label]);
  //   }
  // }, []);

  useEffect(() => {
    debouncedSearch.cancel();
  }, [debouncedSearch]);

  return (
    <div className="relative">
      <div {...getRootProps()} className={`flex flex-col text-sm gap-1 relative ${className}`}>
        <label htmlFor={id} {...getInputLabelProps()} className={`text-gray_dark dark:text-white`}>
          {label}
        </label>
        <div
          className={`bg-[#F9FBFF] relative w-full flex items-center border overflow-hidden dark:text-white dark:bg-green_9 ${
            focus
              ? "shadow-[0_0_0_2px_rgba(135,192,231,1)] dark:shadow-[0_0_0_2px_rgba(135,192,231,1)] border-gray_lighter dark:border-green_8"
              : errorMessage
              ? "border-red text-red"
              : "border-gray_lighter dark:border-green_8"
          } ${open && groupedOptions.length > 0 ? "rounded-tl-lg rounded-tr-lg" : "rounded-lg"}`}
        >
          <div className="absolute left-3">{icon}</div>

          <input
            {...getInputProps()}
            id={id}
            type="text"
            value={search || ""}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            onChange={handleChangeSearch}
            className={`w-full p-2 pl-9 outline-none bg-transparent ${classNameInput}`}
          />
          {search && (
            <button onClick={handleClear} className="bg-[#F9FBFF] dark:bg-green_9 p-2">
              <icons.close className="stroke-black dark:stroke-white w-3" />
            </button>
          )}
        </div>
        {!focus && (
          <span
            className={`text-red text-[10px] absolute bottom-[-17px] left-1 capitalize ${classNameErrorMessage}`}
          >
            {errorMessage}
          </span>
        )}
      </div>
      {groupedOptions.length > 0 ? (
        <div
          className={`absolute bg-white border text-c2 w-full list-none text-sm z-10 dark:bg-green_9 dark:text-white ${
            focus
              ? "rounded-bl-lg rounded-br-lg shadow-[0_0_0_2px_rgba(135,192,231,1)] dark:shadow-[0_0_0_2px_rgba(135,192,231,1)] border-gray_lighter dark:border-green_8"
              : "rounded-lg border-gray_lighter dark:border-green_8"
          }`}
          {...getListboxProps()}
        >
          <div className="max-h-[10rem] overflow-y-auto table-scrollbar">
            {groupedOptions
              .filter((option) =>
                localFilter && search
                  ? option?.[optionsLabel?.label]?.toLowerCase()?.includes(search?.toLowerCase())
                  : option
              )
              .map((option, index) => (
                <li
                  {...getOptionProps({ option, index })}
                  onClick={() => handleSelected(option)}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue_1 ${
                    selected?.[optionsLabel?.value] === option?.[optionsLabel?.value]
                      ? "bg-blue"
                      : ""
                  }`}
                >
                  {option?.[optionsLabel?.label]}
                </li>
              ))}
          </div>
          {/* {createButton && (
            <button onClick={onCreate} className="w-full text-center text-xl bg-c31 py-1">
              +
            </button>
          )} */}
        </div>
      ) : null}
    </div>
  );
}

export default MUISearchSelect;
