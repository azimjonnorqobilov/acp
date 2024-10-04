import { useRef, useState } from "react";
import { icons } from "assets/icons/icons";
import { Popover } from "@mui/material";

function MUIMenu({
  id,
  label,
  value,
  options,
  onChange = () => {},
  themeMode = "",
  className = "",
  buttonLabel,
  optionLabel = { label: "label", value: "value" },
  errorMessage,
  classNameList = "",
  customButton = false,
  focusableSelect = true,
  classNameButton = "",
}) {
  const buttonRef = useRef();
  const [openMenu, setOpenMenu] = useState({ open: false, anchorEl: null });

  const handleOpenMenu = (anchorEl) => setOpenMenu({ open: true, anchorEl });
  const handleCloseMenu = () => setOpenMenu({ ...openMenu, open: false });

  return (
    <div className={`flex flex-col text-[13px] gap-1 relative  ${className}`}>
      {label && (
        <label htmlFor={id} className="text-gray_dark dark:text-white">
          {label}
        </label>
      )}
      {customButton ? (
        <button
          onClick={(e) => (!openMenu?.open ? handleOpenMenu(e.currentTarget) : handleCloseMenu())}
        >
          {buttonLabel(
            options?.filter((opt) => opt?.[optionLabel?.value] === value)?.[0]?.[optionLabel?.label]
          )}
        </button>
      ) : (
        <div
          ref={buttonRef}
          onClick={(e) => (!openMenu?.open ? handleOpenMenu(e.currentTarget) : handleCloseMenu())}
          className={`bg-[#F9FBFF] cursor-pointer relative w-full flex gap-2 items-center rounded-lg border border-gray_lighter dark:border-green_8 overflow-hidden dark:text-white dark:bg-green_9 p-2 ${
            openMenu?.open
              ? focusableSelect
                ? "shadow-[0_0_0_2px_rgba(135,192,231,1)] dark:shadow-[0_0_0_2px_rgba(135,192,231,1)] border-gray_lighter dark:border-green_8"
                : ""
              : errorMessage
              ? "border-red text-red"
              : "border-gray_lighter dark:border-green_8"
          } ${classNameButton}`}
        >
          <icons.arrow
            className={`w-[0.35rem] transition ${errorMessage ? "fill-red" : "dark:fill-white"} ${
              openMenu?.open ? "rotate-90" : "-rotate-90"
            }`}
          />
          <span className="">
            {options?.filter((opt) => opt?.[optionLabel?.value] === value)?.[0]?.[
              optionLabel?.label
            ] || "Choose"}
          </span>
        </div>
      )}
      <Popover
        open={openMenu?.open}
        anchorEl={openMenu?.anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          ".MuiPaper-root": { background: "none", borderRadius: "0.5rem", marginTop: "0.25rem" },
        }}
      >
        <div
          style={{ width: `${buttonRef?.current?.clientWidth}px` }}
          className={`max-h-[15rem] overflow-y-auto table-scrollbar flex flex-col gap-2   ${
            themeMode === "dark"
              ? "bg-green_4 text-white"
              : "bg-white dark:bg-green_4 dark:text-white"
          } ${classNameList}`}
        >
          <div>
            {options?.map((opt) => (
              <p
                key={opt?.[optionLabel?.value]}
                onClick={() => {
                  onChange(opt?.[optionLabel?.value]);
                  handleCloseMenu();
                }}
                className={`w-full cursor-pointer px-4 py-2  text-[13px] ${
                  themeMode === "dark"
                    ? "hover:bg-green_5"
                    : "hover:bg-blue_7 hover:dark:bg-green_5"
                } ${
                  value === opt?.[optionLabel?.value]
                    ? themeMode === "dark"
                      ? "bg-green_8"
                      : "bg-blue_light dark:bg-green_8"
                    : ""
                }`}
              >
                {opt?.[optionLabel?.label]}
              </p>
            ))}
          </div>
        </div>
      </Popover>
    </div>
  );
}

export default MUIMenu;
