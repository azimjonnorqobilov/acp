import { icons } from "assets/icons/icons";

function DeleteCompany({ onDelete, onClose }) {
  return (
    <div className="bg-white p-6 w-[25rem] lg:w-full flex flex-col gap-4 items-center text-center relative rounded-2xl">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>

      <div className="w-[6rem] h-[6rem] mt-2 border border-red rounded-full flex justify-center items-center">
        <icons.trash className="fill-red w-9 h-9" />
      </div>
      <p className="font-bicubik text-2xl dark:text-white">Delete company</p>
      <p className="text-gray text-xl">Are you sure to delete this Company?</p>
      <div className="border border-gray_lighter rounded-xl w-full dark:border-green_11">
        <span className=" text-gray">Company Name</span>
        <p className="font-semibold text-xl dark:text-white">Thinkland</p>
      </div>
      <div className="border border-gray_lighter rounded-xl w-full dark:border-green_11">
        <span className=" text-gray">MC</span>
        <p className="font-semibold text-xl dark:text-white">87979879</p>
      </div>
      <div className="w-full flex gap-4">
        <button
          onClick={onDelete}
          className="w-1/2 bg-red px-10 py-2 rounded-lg gap-2 text-white uppercase"
        >
          Yes
        </button>
        <button
          onClick={onClose}
          className="w-1/2 bg-[#F2F5F9] px-10 py-2 rounded-lg gap-2 text-black uppercase dark:bg-green_11 dark:text-white"
        >
          Not
        </button>
      </div>

      {/* {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
          <BounceDotsLoader />
        </div>
      )} */}
    </div>
  );
}

export default DeleteCompany;
