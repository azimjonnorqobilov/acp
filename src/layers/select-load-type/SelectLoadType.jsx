import { useSelector } from "react-redux";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useSpreadLoadTypes } from "hooks/spreadLoadTypes";
import Checkbox from "components/checkbox/Checkbox";
import { Popover, Tooltip } from "@mui/material";

function SelectLoadType({
  value,
  label,
  onChange = () => {},
  selectType = "select",
  errorMessage = "",
  classNameErrorMessage = "",
}) {
  const { t } = useTranslation();
  const buttonRef = useRef();
  const {
    support: { loadTypes, loadTypesCategories },
  } = useSelector((store) => store);
  const selectedTypes = useSpreadLoadTypes({
    ...value,
    loadTypes,
    loadTypesCategories,
    joinTextCount: 5,
  });
  const [filteredOptions, setFilteredOptions] = useState(loadTypesCategories);
  const [openGroup, setOpenGroup] = useState([]);
  const [openMenu, setOpenMenu] = useState({ open: false, anchor: null });
  const [search, setSearch] = useState({ focus: false, value: "" });

  // const handleOpenOrCloseMenu = () => setOpenMenu(!openMenu);

  const handleOpenMenu = (e) => setOpenMenu({ open: true, anchor: e.currentTarget });
  const handleCloseMenu = () => setOpenMenu({ ...openMenu, open: false });

  const handleSearchType = (value) => {
    setSearch({ ...search, value });
    const searchOptions = value
      ? filteredOptions
          ?.map((gr) => ({
            ...gr,
            types: gr?.types?.map((t) => ({
              ...t,
              visible: t?.name?.toLowerCase()?.includes(value?.toLowerCase()),
            })),
          }))
          ?.map((gr) => ({
            ...gr,
            visible: gr?.types?.some((t) => t?.visible),
          }))
      : filteredOptions?.map((gr) => ({
          ...gr,
          visible: true,
          types: gr?.types?.map((t) => ({ ...t, visible: true })),
        }));
    setFilteredOptions(searchOptions);
  };

  const handleOpenOrCloseTypes = (groupId) => {
    openGroup?.includes(groupId)
      ? setOpenGroup(openGroup?.filter((gr) => gr !== groupId))
      : setOpenGroup([...openGroup, groupId]);
  };

  const handleRefactorSelectedData = (options) => {
    const types = [];
    const categories = [];

    options?.map((gr) =>
      gr?.selected
        ? categories?.push(gr?.id)
        : gr?.types?.map((t) => t?.selected && types?.push(t?.id))
    );
    return { types, categories };
  };

  const handleCheckAll = (value) => {
    const changedCategories = filteredOptions?.map((gr) => {
      return {
        ...gr,
        selected: value,
        types: gr?.types?.map((t) => ({ ...t, selected: value })),
      };
    });

    setFilteredOptions(changedCategories);
    onChange({ types: value ? [1] : [], categories: [] });
  };

  const handleCheckType = (group, type) => {
    const changedSelected = filteredOptions?.map((gr) => {
      if (gr?.id === group) {
        const types = gr?.types?.map((t) =>
          t?.id === type ? { ...t, selected: t?.selected ? false : true } : t
        );

        return { ...gr, selected: types?.every((t) => t?.selected), types };
      } else return gr;
    });

    setFilteredOptions(changedSelected);
    onChange(handleRefactorSelectedData(changedSelected));
  };

  const handleCheckCategory = (group) => {
    const changedCategories = filteredOptions?.map((gr) => {
      if (gr?.id === group) {
        const checkedGroup = gr?.selected ? false : true;
        return {
          ...gr,
          selected: checkedGroup,
          types: gr?.types?.map((t) => ({ ...t, selected: checkedGroup })),
        };
      } else return gr;
    });

    setFilteredOptions(changedCategories);
    onChange(
      changedCategories?.every((c) => c?.selected)
        ? { types: [1], categories: [] }
        : handleRefactorSelectedData(changedCategories)
    );
  };

  const handleKeyUp = (e) => {
    if (!search?.focus && openMenu) {
      loadTypesCategories?.map((gr) => {
        const checked = gr?.name?.toLowerCase() === e?.key?.toLowerCase();
        checked && handleOpenOrCloseTypes(gr?.id);
        return checked;
      });
    }
  };

  useEffect(() => {
    setFilteredOptions(
      loadTypesCategories?.map((gr) => ({
        ...gr,
        types: gr?.types?.map((type) => ({
          ...type,
          visible: true,
          selected:
            value?.types?.includes(1) ||
            value?.categories?.includes(gr?.id) ||
            value?.types?.includes(type?.id),
        })),
        visible: true,
        selected: value?.types?.includes(1) || value?.categories?.includes(gr?.id),
      }))
    );
    setSearch({ focus: false, value: "" });
  }, [loadTypesCategories, openMenu]);

  return (
    <div className="w-full relative select-none" onKeyUp={handleKeyUp}>
      <div className="flex flex-col text-[13px] gap-1 relative">
        <label className="text-gray_dark dark:text-white">{label}</label>
        <button
          ref={buttonRef}
          onClick={handleOpenMenu}
          className={`bg-[#F9FBFF] relative w-full flex items-center  border overflow-hidden dark:text-white dark:bg-green_9 p-2 outline-none ${
            openMenu?.open ? "rounded-t-lg" : "rounded-lg"
          } ${
            openMenu?.open
              ? "shadow-[0_0_0_2px_rgba(135,192,231,1)] dark:shadow-[0_0_0_2px_rgba(135,192,231,1)] border-gray_lighter dark:border-green_8"
              : errorMessage
              ? "border-red text-red"
              : "border-gray_lighter dark:border-green_8"
          }
          }`}
        >
          {selectType === "multiple" ? (
            loadTypes?.length && (value?.types?.length || value?.categories?.length) ? (
              value?.types?.includes(1) ? (
                <span>{t("all")}</span>
              ) : (
                <div className="flex gap-2 items-center">
                  {selectedTypes?.value}
                  {selectedTypes?.selectedCount > selectedTypes?.joinTextCount && (
                    <Tooltip
                      arrow
                      classes={{ tooltip: "tooltip-style", arrow: "tooltip-arrow-style" }}
                      title={
                        <div className="flex flex-col">
                          {selectedTypes?.categories?.length ? (
                            <div className="border-b border-gray_lighter dark:border-green_8 pb-1">
                              <p className="text-black font-bold dark:text-white">{t("groups")}</p>
                              <div
                                className={`grid grid-cols-4 text-center items-center justify-center gap-1 whitespace-nowrap py-1`}
                              >
                                {selectedTypes?.categories?.map((c) => (
                                  <span
                                    key={c?.id}
                                    className="bg-blue_light dark:bg-green_8 border border-gray_lighter dark:border-green_8 text-black dark:text-white py-1 px-2 rounded text-[8px]"
                                  >
                                    {c?.ext}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {selectedTypes?.types?.length && (
                            <div className={`${selectedTypes?.categories?.length ? "pt-1" : ""}`}>
                              <p className="text-black font-bold dark:text-white">{t("types")}</p>
                              <div
                                className={`grid grid-cols-4 text-center items-center justify-center gap-1 whitespace-nowrap py-1`}
                              >
                                {selectedTypes?.types?.map((t) => (
                                  <span
                                    key={t?.id}
                                    className="bg-blue_light dark:bg-green_8 border border-gray_lighter dark:border-green_8 text-black dark:text-white py-1 px-2 rounded text-[8px]"
                                  >
                                    {t?.ext}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      }
                      placement="top-start"
                      className="bg-blue px-3 rounded-lg font-bold text-white"
                    >
                      <span>{selectedTypes?.selectedCount}</span>
                    </Tooltip>
                  )}
                </div>
              )
            ) : (
              t("choose-types")
            )
          ) : loadTypes?.length && value ? (
            loadTypes?.filter((t) => t?.id === value)?.[0]?.name
          ) : (
            t("choose-types")
          )}
        </button>

        <span
          className={`text-red text-[10px] absolute bottom-[-17px] left-1 capitalize ${classNameErrorMessage}`}
        >
          {errorMessage}
        </span>
      </div>

      <Popover
        open={openMenu?.open}
        anchorEl={openMenu?.anchor}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div
          style={{
            width: `${buttonRef?.current?.clientWidth + 2}px`,
          }}
          className="text-sm border-[3px] border-[rgba(135,192,231,1)] bg-[#F9FBFF] dark:bg-green_5 flex flex-col gap-2 items-center py-2 z-[20]"
        >
          <div className="w-full px-2">
            <input
              type="text"
              value={search?.value || ""}
              onFocus={() => setSearch({ ...search, focus: true })}
              onBlur={() => setSearch({ ...search, focus: false })}
              onChange={(e) => handleSearchType(e.target.value)}
              className="w-full px-2 py-2 border border-gray_lighter rounded-lg outline-none dark:bg-green_9 dark:border-green_8 dark:text-white"
              placeholder={t("search")}
            />
          </div>

          <div className="w-full max-h-[15rem] xl:max-h-[10rem] overflow-y-auto table-scrollbar border-b border-t border-gray_lighter dark:border-green_8 dark:text-white">
            {selectType === "multiple" && (
              <div
                className={`flex flex-col gap-1 px-4 py-1 border-b border-gray_lighter dark:border-green_8`}
              >
                <Checkbox
                  label={t("all")}
                  checked={value?.types?.includes(1)}
                  onChange={handleCheckAll}
                  classNameCheckbox="!w-4 !h-4"
                />
              </div>
            )}

            {filteredOptions?.map(
              (group) =>
                group?.visible && (
                  <div key={group?.id}>
                    <div className="w-full pl-4 cursor-pointer border-b border-gray_lighter dark:border-green_8 flex items-center justify-between">
                      {selectType === "multiple" && (
                        <Checkbox
                          checked={group?.selected ? true : false}
                          onChange={() => handleCheckCategory(group?.id)}
                          classNameCheckbox="!w-4 !h-4"
                        />
                      )}
                      <div
                        onClick={() => handleOpenOrCloseTypes(group?.id)}
                        className="w-full py-1 pr-4 flex items-center justify-between"
                      >
                        <span className="text-[13px]">{group?.name}</span>
                        {!search?.value && (
                          <icons.arrow
                            className={`fill-[#000000] dark:fill-white w-[0.4rem] transition ${
                              openGroup?.includes(group?.id) ? "rotate-90" : "-rotate-90"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                    {(search?.value || openGroup?.includes(group?.id)) && (
                      <div
                        className={`bg-[#ffffff] flex flex-col dark:bg-green_7 cursor-pointer ${
                          selectType === "multiple" ? "gap-1 px-4 py-1" : ""
                        }`}
                      >
                        {group?.types?.map((type) =>
                          selectType === "multiple"
                            ? type?.visible && (
                                <Checkbox
                                  key={type?.id}
                                  label={type?.name}
                                  checked={type?.selected ? true : false}
                                  onChange={() => handleCheckType(group?.id, type?.id)}
                                  classNameCheckbox="!w-4 !h-4 "
                                  className="!text-[13px]"
                                />
                              )
                            : type?.visible && (
                                <span
                                  key={type?.id}
                                  onClick={() => onChange(type?.id)}
                                  className={`px-6 py-1 hover:bg-[#D8ECF9] dark:hover:bg-green_4 text-[13px] ${
                                    value === type?.id ? "bg-[#87C0E7] dark:bg-green_6" : ""
                                  }`}
                                >
                                  {type?.name}
                                </span>
                              )
                        )}
                      </div>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
      </Popover>
    </div>
  );
}

export default SelectLoadType;
