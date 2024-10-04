import dayjs from "dayjs";
import { useMutation } from "react-query";
import { icons } from "assets/icons/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { editContact } from "store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { createTruck, updateTruck } from "store/slices/truckSlice";
import {
  createLoad,
  updateLoad,
  createShipperLoad,
  updateShipperLoad,
} from "store/slices/loadSlice";
import {
  getPlaces,
  getDistance,
  getLoadTypes,
  getLoadTypesCategories,
} from "store/slices/supportSlice";
import MUISearchSelect from "components/mui-select/MUISearchSelect";
import SelectLoadType from "layers/select-load-type/SelectLoadType";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import ButtonsGroup from "components/buttons-group/ButtonsGroup";
import DatePicker from "components/date-picker/DatePicker";
import Textarea from "components/textarea/Textarea";
import Input from "components/input/Input";

const LAST_USED_DEFAULT_LS_KEY = "new-post-last-used-default";

function NewPost({ action, load, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const lastUsedDefaultLS = JSON.parse(localStorage.getItem(LAST_USED_DEFAULT_LS_KEY));
  const {
    auth: { userInfo },
    support: { places, distance, loadTypesCategories },
  } = useSelector((store) => store);
  const [errorMessages, setErrorMessages] = useState({});
  const [post, setPost] = useState(
    action === "create" || (action === "edit" && !load?.id)
      ? {
          type_operator: "ALL",
          truck_status:
            userInfo?.entity_type === "carrier"
              ? lastUsedDefaultLS?.truck_status || "BOTH"
              : lastUsedDefaultLS?.truck_status && lastUsedDefaultLS?.truck_status !== "BOTH"
              ? lastUsedDefaultLS?.truck_status
              : "FTL",
          notification_status: true,
          contact_type: "phone",
          contact: userInfo?.phone || null,
          age: lastUsedDefaultLS?.age || 4,
          length: lastUsedDefaultLS?.length || 53,
          weight: lastUsedDefaultLS?.weight || null,
          pickup_date: [dayjs(new Date())?.format("YYYY-MM-DD")],
          name: `${userInfo?.first_name || ""} ${userInfo?.last_name}`,
          // ...(userInfo?.entity_type === "broker" && { type: lastUsedDefaultLS?.type }),
        }
      : {
          ...load,
          distance: load?.distance || 0,
          type: load?.type?.id || (load?.type?.length ? load?.type?.map((t) => t?.id) : []),
          type_category:
            load?.type?.id || !load?.type_category?.length
              ? []
              : load?.type_category?.map((t) => t?.id),
        }
  );

  const handleChangePost = (name, value) => {
    setPost({
      ...post,
      [name]: value,
      ...(name === "origin" && { dh_o: value ? 100 : "" }),
      ...(name === "destination" && { dh_d: value ? 100 : "" }),
      ...(name === "contact_type" && { contact: userInfo?.[value] || "" }),
    });
    setErrorMessages({
      ...errorMessages,
      [name]: "",
      ...(name === "origin" && { dh_o: "" }),
      ...(name === "destination" && { dh_d: "" }),
    });
  };

  const validationNewPost = (load) => {
    let messages = {};

    if (!load?.origin) {
      messages = { ...messages, origin: "Origin required!", dh_o: "DH-O required!" };
    }
    if (load?.origin && !load?.dh_o) {
      messages = { ...messages, dh_o: "DH-O required!" };
    }
    if (userInfo?.entity_type !== "carrier" && !load?.destination) {
      messages = { ...messages, destination: "Destination required!", dh_d: "DH-D required!" };
    }
    if (load?.destination && !load?.dh_d) {
      messages = { ...messages, dh_d: "DH-D required!" };
    }
    if (!load?.pickup_date) {
      messages = { ...messages, pickup_date: "Pickup date required!" };
    }
    if (!load?.age) {
      messages = { ...messages, age: "Age required!" };
    }
    if (
      (userInfo?.entity_type === "carrier" &&
        !load?.type?.length &&
        !load?.type_category?.length) ||
      (userInfo?.entity_type !== "carrier" && !load?.type)
    ) {
      messages = { ...messages, type: "Type required!" };
    }
    if (
      load?.contact_type === "phone" &&
      !post?.contact
        ?.replaceAll("(", "")
        ?.replaceAll(")", "")
        ?.replaceAll("-", "")
        ?.replaceAll("_", "")
        ?.replaceAll(" ", "")
    )
      handleChangePost("contact", "");

    setErrorMessages(messages);

    return Object.keys(messages)?.length ? false : true;
  };

  const validationUpdatePost = (search) => {
    let updatePost = { id: search?.id };
    let messages = {};

    Object.keys(search)?.map(
      (key) =>
        search?.[key] !== load?.[key] && (updatePost = { ...updatePost, [key]: search?.[key] })
    );

    if (updatePost?.origin === null) {
      messages = { ...messages, origin: "Origin required!", dh_o: "DH-O required!" };
    }
    if (updatePost?.dh_o === null && search?.origin) {
      messages = { ...messages, dh_o: "DH-O required!" };
    }
    if (userInfo?.entity_type !== "carrier" && updatePost?.destination === null) {
      messages = { ...messages, destination: "Destination required!", dh_d: "DH-D required!" };
    }
    if (updatePost?.destination && !updatePost?.dh_d) {
      messages = { ...messages, dh_d: "DH-D required!" };
    }
    if (updatePost?.pickup_date === null) {
      messages = { ...messages, pickup_date: "Pickup date required!" };
    }
    if (updatePost?.age === null) {
      messages = { ...messages, age: "Age required!" };
    }
    if (
      (userInfo?.entity_type === "carrier" &&
        !updatePost?.type?.length &&
        !updatePost?.type_category?.length) ||
      (userInfo?.entity_type !== "carrier" && !updatePost?.type)
    ) {
      messages = { ...messages, type: "Type required!" };
    }
    if (
      load?.contact_type === "phone" &&
      !post?.contact
        ?.replaceAll("(", "")
        ?.replaceAll(")", "")
        ?.replaceAll("-", "")
        ?.replaceAll("_", "")
        ?.replaceAll(" ", "")
    )
      handleChangePost("contact", "");

    setErrorMessages(messages);

    return Object.keys(messages)?.length ? false : updatePost;
  };

  console.log(post);
  const handleSave = () => {
    !userInfo?.[post?.contact_type] &&
      post?.contact_type !== "email" &&
      post?.contact &&
      dispatch(
        editContact({
          [post?.contact_type]: post?.contact,
          [post?.contact_type === "phone" ? "telegram" : "phone"]:
            userInfo?.[post?.contact_type === "phone" ? "telegram" : "phone"],
        })
      );

    localStorage.setItem(
      LAST_USED_DEFAULT_LS_KEY,
      JSON.stringify({
        ...lastUsedDefaultLS,
        ...(post?.age && { age: post?.age }),
        ...(post?.length && { length: post?.length }),
        ...(post?.weight && { weight: post?.weight }),
        ...(post?.type && { type: post?.type }),
        ...(post?.type_category && { type_category: post?.type_category }),
        ...(post?.truck_status && { truck_status: post?.truck_status }),
      })
    );

    if (userInfo?.entity_type === "broker") {
      if (action === "create") {
        if (validationNewPost(post))
          return dispatch(createLoad({ role: userInfo?.entity_type, newLoad: post }));
      } else {
        console.log(post);

        if (validationUpdatePost(post))
          return dispatch(
            updateLoad({ role: userInfo?.entity_type, load: validationUpdatePost(post) })
          );
      }
    }

    if (userInfo?.entity_type === "carrier") {
      if (action === "create") {
        if (validationNewPost(post))
          return dispatch(createTruck({ role: userInfo?.entity_type, newTruck: post }));
      } else {
        if (validationUpdatePost(post))
          return dispatch(
            updateTruck({ role: userInfo?.entity_type, truck: validationUpdatePost(post) })
          );
      }
    }

    if (userInfo?.entity_type === "shipper") {
      if (action === "create") {
        if (validationNewPost(post))
          return dispatch(createShipperLoad({ role: userInfo?.entity_type, newLoad: post }));
      } else return dispatch(updateShipperLoad({ role: userInfo?.entity_type, load: post }));
    }
  };

  const { mutate: onSave, isLoading: isSaving } = useMutation("new-post-save", handleSave);

  useEffect(() => {
    dispatch(getLoadTypesCategories());
    dispatch(getLoadTypes());
  }, [dispatch]);

  // console.log(typeof lastUsedDefaultLS?.type);

  useEffect(() => {
    action === "create" &&
      setPost({
        ...post,
        ...(userInfo?.entity_type === "carrier"
          ? typeof lastUsedDefaultLS?.type !== "number"
            ? {
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
              }
            : { type_category: [], type: [] }
          : { type: typeof lastUsedDefaultLS?.type === "number" ? lastUsedDefaultLS?.type : "" }),
      });
  }, [loadTypesCategories]);

  useEffect(() => {
    post?.origin && post?.destination
      ? !post?.distance &&
        dispatch(getDistance({ origin: post?.origin, destination: post?.destination }))
      : handleChangePost("distance", 0);
  }, [post?.origin, post?.destination, dispatch]);

  useEffect(() => {
    post?.origin && post?.destination && !post?.distance && handleChangePost("distance", distance);
  }, [distance]);

  return (
    <div className="bg-white w-[50rem] max-h-[98%]  rounded-xl flex flex-col relative dark:bg-green_7 lg:w-[96%]">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>
      <p className="font-bicubik dark:text-white px-6 pt-6 lg:px-4 lg:pt-4">
        {userInfo?.entity_type === "carrier"
          ? action === "create"
            ? t("new-truck")
            : t("update-truck")
          : action === "create"
          ? t("new-load")
          : t("update-load")}
      </p>

      <div className="flex flex-col gap-4 table-scrollbar overflow-y-auto px-6 pb-1 mt-4 lg:px-4 lg:pb-4 ">
        <div className="flex justify-between items-end gap-4 lg:gap-2 lg:flex-col">
          <div className="w-full grid grid-cols-[1fr_0.4fr] gap-2">
            <MUISearchSelect
              icon={<icons.location className="fill-gray_dark" />}
              label={t("origin")}
              value={post?.origin || ""}
              options={places}
              onChange={(e) => dispatch(getPlaces(e.target.value))}
              onSelected={(e) => handleChangePost("origin", e || null)}
              placeholder={t("origin")}
              errorMessage={errorMessages?.origin || ""}
            />
            <Input
              id="dh-o"
              type="number"
              label={t("dh-o")}
              value={post?.dh_o || ""}
              disabled={!post?.origin}
              inputMode="numeric"
              placeholder={t("dh-o")}
              onChange={(e) =>
                e.target.value >= 0 &&
                handleChangePost(
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
              {Math.ceil(post?.distance) || 0} mi
            </span>
            <div className="flex-auto h-[1px] bg-gray mr-1 dark:bg-[#3E6277]" />
            <div className="w-3 h-3 bg-blue rounded-full" />
          </div>
          <div className="w-full grid grid-cols-[1fr_0.4fr] gap-2">
            <MUISearchSelect
              icon={<icons.location className="fill-gray_dark" />}
              label={t("destination")}
              value={post?.destination || ""}
              options={places}
              onChange={(e) => dispatch(getPlaces(e.target.value))}
              onSelected={(e) => handleChangePost("destination", e || null)}
              placeholder={t("destination")}
              errorMessage={errorMessages?.destination || ""}
            />
            <Input
              id="dh-d"
              type="number"
              label={t("dh-d")}
              value={post?.dh_d || ""}
              disabled={!post?.destination}
              inputMode="numeric"
              placeholder={t("dh-d")}
              onChange={(e) =>
                e.target.value >= 0 &&
                handleChangePost(
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
            value={post?.pickup_date || []}
            placeholder={t("pu-date")}
            onChange={(value) => handleChangePost("pickup_date", value || null)}
            errorMessage={errorMessages?.pickup_date || ""}
          />
          <Input
            id="age"
            type="number"
            label={t("age")}
            value={post?.age || ""}
            inputMode="numeric"
            placeholder={t("age")}
            onChange={(e) =>
              (e.target.value > 0 || e.target.value === '') &&
              handleChangePost("age", e.target.value <= 48 ? e.target.value || null : 48)
            }
            errorMessage={errorMessages?.age || ""}
          />
          <Input
            id="length"
            type="number"
            label={t("length")}
            value={post?.length || null}
            inputMode="numeric"
            placeholder={t("length")}
            onChange={(e) =>
              e.target.value >= 0 &&
              handleChangePost("length", e.target.value < 99 ? e.target.value || null : 99)
            }
          />
          <Input
            id="weight"
            type="number"
            label={t("weight")}
            value={post?.weight || null}
            inputMode="numeric"
            numberMask
            placeholder={t("weight")}
            onChange={(e) =>
              e.target.value >= 0 &&
              handleChangePost(
                "weight",
                e.target.value?.replaceAll(" ", "") < 99999 ? e.target.value || null : 99999
              )
            }
          />
          <DatePicker
            id="dlv-date"
            label={t("dlv-date")}
            value={post?.dlv_date || []}
            placeholder={t("dlv-date")}
            onChange={(value) => handleChangePost("dlv_date", value || null)}
          />
          <Input
            id="ref"
            // type="number"
            label={t("ref")}
            value={post?.ref_number || ""}
            inputMode="numeric"
            placeholder={t("ref")}
            onChange={(e) => handleChangePost("ref_number", e.target.value || null)}
          />
          <Input
            id="commodity"
            label={t("commodity")}
            value={post?.commodity || ""}
            placeholder={t("commodity")}
            onChange={(e) => handleChangePost("commodity", e.target.value || null)}
          />
          <Input
            id="price"
            type="number"
            label={t("price")}
            value={post?.price || ""}
            inputMode="numeric"
            maxLength={6}
            numberMask
            placeholder={t("price")}
            onChange={(e) =>
              e.target.value >= 0 && handleChangePost("price", e.target.value || null)
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4 items-end lg:grid-cols-1">
          {userInfo?.entity_type === "carrier" ? (
            <SelectLoadType
              label={t("types")}
              value={{ types: post?.type || [], categories: post?.type_category || [] }}
              selectType="multiple"
              onChange={({ types, categories }) => {
                setPost({ ...post, type: types, type_category: categories });
                setErrorMessages({ ...errorMessages, type: "" });
              }}
              errorMessage={errorMessages?.type || ""}
            />
          ) : (
            <SelectLoadType
              value={post?.type || ""}
              label={t("types")}
              selectType="select"
              onChange={(value) => handleChangePost("type", value || null)}
              errorMessage={errorMessages?.type || ""}
            />
          )}
          <ButtonsGroup
            label={t("FTL/LTL")}
            active={post?.truck_status}
            buttons={
              userInfo?.entity_type === "carrier"
                ? [
                    { label: "Both", value: "BOTH" },
                    { label: "FTL", value: "FTL" },
                    { label: "LTL", value: "LTL" },
                  ]
                : [
                    { label: "FTL", value: "FTL" },
                    { label: "LTL", value: "LTL" },
                  ]
            }
            className="!text-[13px]"
            classNameGroup="h-[37.5px] rounded-lg"
            classNameButton="px-4 rounded-lg text-xs"
            onClick={(value) => handleChangePost("truck_status", value)}
          />

          <Input
            id="name"
            label={t("name")}
            value={post?.name || ""}
            placeholder={t("name")}
            onChange={(e) => handleChangePost("name", e.target.value || null)}
          />
          <Input
            id="contact"
            mask={post?.contact_type === "phone" && "(999) 999-9999"}
            label={t("contact")}
            value={post?.contact || ""}
            selectValue={post?.contact_type}
            onChange={(e) => handleChangePost("contact", e.target.value || null)}
            placeholder={
              post?.contact_type === "telegram"
                ? t("username")
                : post?.contact_type === "email"
                ? "example@mail.com"
                : "(999) 999-9999"
            }
            selectOptions={[
              { id: 1, label: t("phone"), value: "phone" },
              { id: 2, label: t("telegram"), value: "telegram" },
              { id: 2, label: t("email"), value: "email" },
            ]}
            onChangeSelect={(e) => handleChangePost("contact_type", e.target.value)}
          />
        </div>

        <Textarea
          id="description"
          rows={4}
          value={post?.comment || ""}
          label={t("description")}
          onChange={(e) => handleChangePost("comment", e.target.value || null)}
          placeholder={t("description")}
          classNameTextarea="resize-none"
        />
      </div>

      <div className="flex justify-end px-6 py-4 lg:px-4 lg:py-3 lg:justify-center lg:w-full lg:shadow-[0_7px_20px_1px_rgba(0,0,0,0.7)] lg:z-[20]">
        <button
          onClick={onSave}
          className="bg-blue px-10 py-2 rounded-lg text-sm text-white uppercase lg:w-full"
        >
          {action === "create" ? t("post") : t("save")}
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

export default NewPost;
