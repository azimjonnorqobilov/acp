import { REFACTOR_SUM } from "assets/constants/constants";
import React from "react";

function UserCard({ label, count }) {
  return (
    <div className="w-full bg-white  rounded-xl p-4 flex flex-col items-center justify-center gap-4">
      <p className="font-bicubik">{label}</p>
      <p className="bg-[#E8EBEF] px-8 pt-3 pb-2 text-4xl font-bold rounded-3xl font-bicubik">
        {REFACTOR_SUM(count, " ")}
      </p>
    </div>
  );
}

export default UserCard;
