import dayjs from "dayjs";
import { useState } from "react";
import { icons } from "assets/icons/icons";
import AntSwitch from "components/mui-switch/AntSwitch";
import ReactDatePicker from "react-datepicker";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CustomHeader = ({
  date,
  range,
  decreaseMonth,
  increaseMonth,
  onChangeRange,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 px-2">
      <div className="absolute left-2">
        <AntSwitch
          checked={range}
          onChange={onChangeRange}
          inputProps={{ "aria-label": "ant design" }}
        />
      </div>
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className={`${prevMonthButtonDisabled ? "opacity-50" : ""}`}
      >
        <icons.arrow className="dark:fill-white" />
      </button>
      <p className="w-[5rem] dark:text-white">{months[new Date(date)?.getMonth()]}</p>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className={`${nextMonthButtonDisabled ? "opacity-50" : ""}`}
      >
        <icons.arrow className="rotate-180 dark:fill-white" />
      </button>
    </div>
  );
};

const renderTimeNow = () => {
  const date = new Date();
  const hours = date?.getHours();
  const minutes = date?.getMinutes();
  const time = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:00`;
  return time;
};

function DatePicker({
  id,
  label = "",
  value,
  minDate = new Date(),
  onChange = () => {},
  placeholder,
  errorMessage = "",
  classNameInput = "",
  classNameErrorMessage = "",
}) {
  const [focus, setFocus] = useState(false);
  const [range, setRange] = useState(value?.length === 2 ? true : false);

  const renderValues = range
    ? {
        startDate:
          value?.[0] && value?.length === 2 ? new Date(`${value?.[0]} ${renderTimeNow()}`) : "",
        endDate:
          value?.[1] && value?.length === 2 ? new Date(`${value?.[1]} ${renderTimeNow()}`) : "",

        onChange: (value) => {
          const [startDate, endDate] = value;
          return onChange([
            startDate ? dayjs(startDate)?.format("YYYY-MM-DD") : "",
            endDate ? dayjs(endDate)?.format("YYYY-MM-DD") : "",
          ]);
        },

        onChangeRaw: (e) => {
          const [startDate, endDate] = [
            e.target.value?.toString()?.split("-")?.[0]?.trimEnd(),
            e.target.value?.toString()?.split("-")?.[1]?.trimStart(),
          ];

          return onChange([
            startDate
              ? `${new Date()?.getFullYear()}-${startDate?.split("/")?.[0]}-${
                  startDate?.split("/")?.[1]
                }`
              : "",
            endDate
              ? `${new Date()?.getFullYear()}-${endDate?.split("/")?.[0]}-${
                  endDate?.split("/")?.[1]
                }`
              : "",
          ]);
        },
      }
    : {
        selected:
          (value?.[0] && value?.length === 1) || (typeof value === "string" && value)
            ? new Date(`${typeof value === "string" ? value : value?.[0]} ${renderTimeNow()}`)
            : "",
        onChange: (value) => onChange(value ? [dayjs(value)?.format("YYYY-MM-DD")] : ""),
      };

  return (
    <div className={`flex flex-col text-[13px] relative`}>
      <label htmlFor={id} className={`text-gray_dark dark:text-white pb-1`}>
        {label}
      </label>
      <ReactDatePicker
        id={id}
        {...renderValues}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        minDate={minDate}
        className={`!bg-[#F9FBFF] relative w-full p-2 outline-none bg-transparent flex items-center rounded-lg border overflow-hidden dark:text-white dark:!bg-green_9  ${
          focus
            ? "shadow-[0_0_0_2px_rgba(135,192,231,1)] dark:shadow-[0_0_0_2px_rgba(135,192,231,1)] border-gray_lighter dark:border-green_8"
            : errorMessage
            ? "border-red text-red"
            : "border-gray_lighter dark:border-green_8"
        }`}
        dateFormat="MM/dd"
        autoComplete="off"
        selectsRange={range}
        placeholderText={placeholder}
        popperPlacement="bottom-start"
        renderCustomHeader={(props) => (
          <CustomHeader
            {...props}
            range={range}
            onChangeRange={() => {
              onChange([]);
              setRange(!range);
            }}
          />
        )}
      />
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

export default DatePicker;
