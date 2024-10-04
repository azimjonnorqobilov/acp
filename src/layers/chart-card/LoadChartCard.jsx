import { icons } from "assets/icons/icons";
import LineChart from "components/charts/LineChart";
import MUIMenu from "components/mui-menu/MUIMenu";
import { useState } from "react";

function LoadChartCard({ label }) {
  const [filter, setFilter] = useState("");

  return (
    <>
      <div className="w-full rounded-xl bg-white">
        <div className="px-4 py-2 border-b border-[#EDF2F9] flex justify-between">
          <span className="font-bicubik">{label}</span>
          <MUIMenu
            value={filter || ""}
            customButton={true}
            buttonLabel={(label) => (
              <div className="flex items-center gap-2">
                <icons.calendar className="fill-[#9199A5]" />{" "}
                <span className="text-sm">{label || "Month"}</span>
                <icons.arrow className="fill-[#546172] -rotate-90 w-[0.4rem]" />
              </div>
            )}
            options={[{ id: 0, label: "Month", value: "" }]}
            onChange={(value) => setFilter(value)}
          />
        </div>

        <div className="w-full overflow-x-auto px-2 pt-2 pb-4">
          <LineChart />
        </div>
      </div>
    </>
  );
}

export default LoadChartCard;
