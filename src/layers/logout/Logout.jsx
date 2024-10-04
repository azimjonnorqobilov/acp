import { icons } from "assets/icons/icons";

function Logout({ onLogout, onClose }) {
  return (
    <div className="bg-white w-[18rem] px-4 pt-10 pb-6 rounded-xl flex flex-col items-center gap-4 relative dark:bg-green_7 relative">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>

      <p className="w-[80%] text-center uppercase font-bicubik dark:text-white">
        Are you sure to log out?
      </p>
      <div className="w-[80%] flex gap-4">
        <button
          onClick={onLogout}
          className="w-1/2 bg-blue px-4 py-2 rounded-lg text-sm text-white uppercase"
        >
          Yes
        </button>
        <button
          onClick={onClose}
          className="w-1/2 bg-[#F2F5F9] px-4 py-2 rounded-lg text-sm uppercase dark:bg-green_8 dark:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Logout;
