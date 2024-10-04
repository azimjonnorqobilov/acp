import { range } from "lodash";
// import { useState } from "react";
import { icons } from "assets/icons/icons";

function RatingStars({
  count = 5,
  rating = 0,
  variable = true,
  onChange = () => {},
  className = "",
  classNameStars = "",
}) {
  // const [degree, setDegree] = useState(rating);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {range(count)?.map((_, idx) => (
        <span
          key={idx}
          onClick={() => {
            // variable && setDegree(idx + 1);
            variable && onChange(idx + 1);
          }}
        >
          <icons.star
            className={` ${idx < rating ? "fill-blue" : "fill-gray dark:fill-[#8599B3]"} ${
              variable ? "cursor-pointer" : ""
            } ${classNameStars}`}
          />
        </span>
      ))}
    </div>
  );
}

export default RatingStars;
