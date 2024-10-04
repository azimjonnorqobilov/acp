import { range } from "lodash";
import { Fragment } from "react";
import { icons } from "assets/icons/icons";

function Step({ count, step = 1 }) {
  return (
    <div className="flex items-center gap-1">
      {range(count).map((idx) => (
        <Fragment key={idx}>
          <div
            key={idx}
            className={`w-6 h-6 border border-gray rounded-full flex justify-center items-center before:content-[' '] before:w-4 before:h-4 before:absolute before:rounded-full ${
              step === idx
                ? "before:bg-blue"
                : step > idx
                ? "bg-blue border-blue"
                : "before:bg-gray"
            }`}
          >
            <icons.check className="fill-white w-3" />
          </div>
          {idx < count - 1 && (
            <div className={`w-[2rem] h-[0.1rem]  ${idx < step ? "bg-blue" : "bg-gray"}`} />
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default Step;
