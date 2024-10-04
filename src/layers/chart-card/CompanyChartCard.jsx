import DoughnutChart from "components/charts/DoughnutChart";
import React from "react";

function CompanyChartCard({ label }) {
  return (
    <div className="w-full bg-white  rounded-xl p-6 flex items-center justify-between">
      <div>
        <p className="font-bicubik">{label}</p>
        <div className="grid grid-cols-[1rem_6rem_auto] items-center gap-y-2 pt-2">
          <div className="w-4 h-4 bg-[#51BBF0] rounded-full" />
          <span className="px-2 text-[#546172]">Verified:</span>
          <span className="text-lg font-bold">10 000</span>

          <div className="w-4 h-4 bg-[#FEC751] rounded-full" />
          <span className="px-2 text-[#546172]">Unverified:</span>
          <span className="text-lg font-bold">3 583</span>
        </div>
      </div>

      <div className="w-[45%] h-auto flex items-center justify-center relative">
        <div className="flex flex-col items-center absolute">
          <span className="text-xl">13 583</span>
          <span className="text-sm text-[#546172]">Total</span>
        </div>
        <DoughnutChart />
      </div>
    </div>
  );
}

export default CompanyChartCard;
