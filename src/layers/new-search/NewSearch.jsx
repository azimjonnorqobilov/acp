import dayjs from "dayjs";
import { useMutation } from "react-query";
import { icons } from "assets/icons/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  newSearchLoad,
  updateSearchLoad,
  newSearchShipperLoad,
  updateSearchShipperLoad,
} from "store/slices/loadSlice";
import {
  getPlaces,
  getDistance,
  getLoadTypes,
  getLoadTypesCategories,
} from "store/slices/supportSlice";
import { newSearchTruck, updateSearchTruck } from "store/slices/truckSlice";
import MUISearchSelect from "components/mui-select/MUISearchSelect";
import SelectLoadType from "layers/select-load-type/SelectLoadType";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import ButtonsGroup from "components/buttons-group/ButtonsGroup";
import DatePicker from "components/date-picker/DatePicker";
import Input from "components/input/Input";

const LAST_USED_DEFAULT_LS_KEY = "new-search-last-used-default";

function NewSearch({ action, load, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const lastUsedDefaultLS = JSON.parse(localStorage.getItem(LAST_USED_DEFAULT_LS_KEY));
  const { pathname } = useLocation();
  const {
    auth: { userInfo },
    support: { places, distance, loadTypesCategories },
  } = useSelector((store) => store);
  const [errorMessages, setErrorMessages] = useState({});
  const [search, setSearch] = useState(
    action === "create" || (action === "edit" && !load?.id)
      ? {
          type_operator: "ALL",
          truck_status: lastUsedDefaultLS?.truck_status || "BOTH",
          notification_status: false,
          length: lastUsedDefaultLS?.length || 53,
          weight: lastUsedDefaultLS?.weight || null,
          age: lastUsedDefaultLS?.age || 4,
          pickup_date: [dayjs(new Date())?.format("YYYY-MM-DD")],
        }
      : {
          ...load,
          type: load?.type?.length ? load?.type?.map((t) => t?.id) : [],
          type_category: load?.type_category?.length ? load?.type_category?.map((c) => c?.id) : [],
        }
  );

  const currentPath = pathname?.split("/");

  const handleChangeSearch = (name, value) => {
    setSearch({
      ...search,
      [name]: value,
      ...(name === "destination" && { dh_d: value ? 100 : null }),
      ...(name === "origin" && { dh_o: value ? 100 : null }),
    });

    setErrorMessages({
      ...errorMessages,
      [name]: "",
      ...(name === "destination" && { dh_d: null }),
      ...(name === "origin" && { dh_o: null }),
    });
  };

  const validationNewSearch = (search) => {
    let messages = {};

    if (!search?.origin && !search?.destination) {
      messages = { ...messages, origin: "Origin required!", dh_o: "DH-O required!" };
    }
    if (search?.origin && !search?.dh_o) {
      messages = { ...messages, dh_o: "DH-O required!" };
    }
    if (search?.destination && !search?.dh_d) {
      messages = { ...messages, dh_d: "DH-D required!" };
    }
    if (!search?.pickup_date) {
      messages = { ...messages, pickup_date: "Pickup date required!" };
    }
    if (!search?.age) {
      messages = { ...messages, age: "Age required!" };
    }
    if (!search?.type?.length && !search?.type_category?.length) {
      messages = { ...messages, type: "Type required!" };
    }
    setErrorMessages(messages);
    return Object.keys(messages)?.length ? false : true;
  };

  const validationUpdateSearch = (search) => {
    let updateSearch = { id: search?.id };
    let messages = {};

    Object.keys(search)?.map(
      (key) =>
        search?.[key] !== load?.[key] && (updateSearch = { ...updateSearch, [key]: search?.[key] })
    );

    if (updateSearch?.origin === null && !search?.destination) {
      messages = { ...messages, origin: "Origin required!", dh_o: "DH-O required!" };
    }
    if (updateSearch?.dh_o === null && search?.origin) {
      messages = { ...messages, dh_o: "DH-O required!" };
    }
    if (updateSearch?.destination === null && !search?.origin) {
      messages = { ...messages, origin: "Origin required!", dh_o: "DH-O required!" };
    }
    if (updateSearch?.dh_d === null && search?.destination) {
      messages = { ...messages, dh_d: "DH-D required!" };
    }
    if (updateSearch?.pickup_date === null) {
      messages = { ...messages, pickup_date: "Pickup date required!" };
    }
    if (updateSearch?.age === null) {
      messages = { ...messages, age: "Age required!" };
    }
    if (!updateSearch?.type?.length && !updateSearch?.type_category?.length) {
      messages = { ...messages, type: "Type required!" };
    }

    setErrorMessages(messages);

    return Object.keys(messages)?.length ? false : updateSearch;
  };

  const handleSave = (e) => {
    localStorage.setItem(
      LAST_USED_DEFAULT_LS_KEY,
      JSON.stringify({
        ...lastUsedDefaultLS,
        ...(search?.age && { age: search?.age }),
        ...(search?.length && { length: search?.length }),
        ...(search?.weight && { weight: search?.weight }),
        ...(search?.type && { type: search?.type }),
        ...(search?.type_category && { type_category: search?.type_category }),
        ...(search?.truck_status && { truck_status: search?.truck_status }),
      })
    );

    if (userInfo?.entity_type === "carrier" || userInfo?.entity_type === "carrier-dispatcher") {
      if (action === "create") {
        if (validationNewSearch(search))
          return dispatch(newSearchLoad({ search, role: userInfo?.entity_type }));
      } else {
        if (validationUpdateSearch(search))
          return dispatch(
            updateSearchLoad({
              search: validationUpdateSearch(search),
              role: userInfo?.entity_type,
            })
          );
      }
    }

    if (userInfo?.entity_type === "broker" && currentPath?.[2] === "find-trucks") {
      if (action === "create") {
        if (validationNewSearch(search))
          return dispatch(newSearchTruck({ search, role: userInfo?.entity_type }));
      } else {
        if (validationUpdateSearch(search))
          return dispatch(
            updateSearchTruck({
              search: validationUpdateSearch(search),
              role: userInfo?.entity_type,
            })
          );
      }
    }

    if (userInfo?.entity_type === "broker" && currentPath?.[2] === "shippers-loads") {
      if (action === "create") {
        if (validationNewSearch(search))
          return dispatch(newSearchShipperLoad({ search, role: userInfo?.entity_type }));
      } else {
        if (validationUpdateSearch(search))
          return dispatch(
            updateSearchShipperLoad({
              search: validationUpdateSearch(search),
              role: userInfo?.entity_type,
            })
          );
      }
    }
  };

  const { mutate: onSave, isLoading: isSaving } = useMutation("new-search-save", handleSave);

  useEffect(() => {
    dispatch(getLoadTypesCategories());
    dispatch(getLoadTypes());
  }, [dispatch]);

  useEffect(() => {
    action === "create" &&
      setSearch({
        ...search,
        type_category: lastUsedDefaultLS?.type_category?.length
          ? lastUsedDefaultLS?.type_category
          : lastUsedDefaultLS?.type?.length
          ? []
          : loadTypesCategories?.map((t) => t?.id),
        type: lastUsedDefaultLS?.type?.length
          ? lastUsedDefaultLS?.type
          : lastUsedDefaultLS?.type_category?.length
          ? []
          : [1],
      });
  }, [loadTypesCategories]);

  useEffect(() => {
    search?.origin && search?.destination
      ? !search?.distance &&
        dispatch(getDistance({ origin: search?.origin, destination: search?.destination }))
      : handleChangeSearch("distance", 0);
  }, [search?.origin, search?.destination]);

  useEffect(() => {
    search?.origin &&
      search?.destination &&
      !search?.distance &&
      handleChangeSearch("distance", distance);
  }, [distance]);

  return (
    <div className="bg-white w-[50rem] rounded-xl flex flex-col relative dark:bg-green_7 lg:w-[96%] lg:max-h-[98%]">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>
      <p className="font-bicubik dark:text-white px-6 pt-6 lg:px-4 lg:pt-4">
        {action === "create" ? t("new-search") : t("update-search")}
      </p>

      <div className="flex flex-col gap-4 table-scrollbar px-6 mt-4 lg:overflow-y-auto lg:px-4 lg:pb-4  lg:mt-2">
        <div className="flex justify-between items-end gap-4 lg:gap-2 lg:flex-col">
          <div className="w-full grid grid-cols-[1fr_0.4fr] gap-2">
            <MUISearchSelect
              id="origin"
              icon={<icons.location className="fill-gray_dark" />}
              label={t("origin")}
              value={search?.origin || ""}
              options={places}
              onChange={(e) => dispatch(getPlaces(e.target.value))}
              onSelected={(e) => handleChangeSearch("origin", e || null)}
              placeholder={t("origin")}
              errorMessage={errorMessages?.origin || ""}
            />
            <Input
              id="dh-o"
              label={t("dh-o")}
              value={search?.dh_o || ""}
              disabled={!search?.origin}
              placeholder={t("dh-o")}
              onChange={(e) =>
                e.target.value >= 0 &&
                handleChangeSearch(
                  "dh_o",
                  e.target.value?.replaceAll(" ", "") < 999 ? e.target.value || null : 999
                )
              }
              errorMessage={errorMessages?.dh_o || ""}
            />
          </div>
          <div className="flex items-center pb-2 lg:pt-2 lg:w-full">
            <div className="w-3 h-3 bg-blue rounded-full" />
            <div className="flex-auto h-[1px] bg-gray ml-1 dark:bg-[#3E6277]" />
            <span className="px-2 text-sm text-center whitespace-nowrap dark:text-white">
              {Math.ceil(search?.distance) || 0} mi
            </span>
            <div className="flex-auto h-[1px] bg-gray mr-1 dark:bg-[#3E6277]" />
            <div className="w-3 h-3 bg-blue rounded-full" />
          </div>
          <div className="w-full grid grid-cols-[1fr_0.4fr] gap-2">
            <MUISearchSelect
              id="destionation"
              icon={<icons.location className="fill-gray_dark" />}
              label={t("destination")}
              value={search?.destination || ""}
              options={places}
              onChange={(e) => dispatch(getPlaces(e.target.value))}
              onSelected={(e) => handleChangeSearch("destination", e || null)}
              placeholder={t("destination")}
              errorMessage={errorMessages?.destination || ""}
            />
            <Input
              id="dh-d"
              label={t("dh-d")}
              value={search?.dh_d || ""}
              disabled={!search?.destination}
              placeholder={t("dh-d")}
              onChange={(e) =>
                e.target.value >= 0 &&
                handleChangeSearch(
                  "dh_d",
                  e.target.value?.replaceAll(" ", "") < 999 ? e.target.value || null : 999
                )
              }
              errorMessage={errorMessages?.dh_d || ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 lg:gap-x-2">
          <DatePicker
            id="pu-date"
            label={t("pu-date")}
            value={search?.pickup_date}
            placeholder={t("pu-date")}
            onChange={(value) => {
              handleChangeSearch("pickup_date", value || null);
            }}
            errorMessage={errorMessages?.pickup_date || ""}
          />
          <Input
            id="age"
            label={t("age")}
            value={search?.age || ""}
            placeholder={t("age")}
            onChange={(e) =>
              (e.target.value > 0 || e.target.value === "") &&
              handleChangeSearch("age", e.target.value <= 48 ? e.target.value || null : 48)
            }
            errorMessage={errorMessages?.age || ""}
          />
          <Input
            id="length"
            label={t("length")}
            value={search?.length || ""}
            numberMask
            placeholder={t("length")}
            onChange={(e) =>
              e.target.value >= 0 &&
              handleChangeSearch(
                "length",
                e.target.value?.replaceAll(" ", "") < 99999 ? e.target.value || null : 99999
              )
            }
          />
          <Input
            id="weight"
            label={t("weight")}
            value={search?.weight || ""}
            numberMask
            placeholder={t("weight")}
            onChange={(e) =>
              e.target.value >= 0 &&
              handleChangeSearch(
                "weight",
                e.target.value?.replaceAll(" ", "") < 99999 ? e.target.value || null : 99999
              )
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4 items-end lg:grid-cols-1 ">
          <SelectLoadType
            label={t("types")}
            value={{ types: search?.type || [], categories: search?.type_category || [] }}
            selectType="multiple"
            onChange={({ types, categories }) => {
              setSearch({ ...search, type: types, type_category: categories });
              setErrorMessages({ ...errorMessages, type: "" });
            }}
            errorMessage={errorMessages?.type || ""}
          />

          <ButtonsGroup
            label={t("FTL/LTL")}
            active={search?.truck_status}
            buttons={[
              { label: "Both", value: "BOTH" },
              { label: "FTL", value: "FTL" },
              { label: "LTL", value: "LTL" },
            ]}
            className="!text-[13px]"
            classNameGroup="h-[37.5px] rounded-lg"
            classNameButton="px-4 rounded-lg text-xs"
            onClick={(value) => handleChangeSearch("truck_status", value)}
          />
        </div>
      </div>

      <div className="flex justify-end px-6 py-4 lg:px-4 lg:py-3 lg:justify-center lg:w-full lg:shadow-[0_7px_20px_1px_rgba(0,0,0,0.7)] lg:z-[20]">
        <button
          onClick={onSave}
          className="bg-blue px-10 py-2 rounded-lg text-sm text-white uppercase lg:w-full"
        >
          {action === "create" ? t("search") : t("save")}
        </button>
      </div>

      {isSaving && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
          <BounceDotsLoader />
        </div>
      )}
    </div>
  );
}

export default NewSearch;
