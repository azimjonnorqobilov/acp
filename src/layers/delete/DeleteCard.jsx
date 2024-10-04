import { icons } from "assets/icons/icons";
import BounceDotsLoader from "components/loader/BounceDotsLoader";

function DeleteCard({
  more = [],
  title = "Delete",
  onClose,
  onDelete,
  isLoading,
  description = "Are you sure to delete?",
}) {
  return (
    <div className="bg-white p-6 w-[25rem] lg:w-full flex flex-col gap-4 items-center text-center relative overflow-hidden rounded-2xl">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>

      {isLoading && (
        <div className="absolute w-full h-full flex items-center justify-center z-10 top-0 left-0 backdrop-brightness-90 backdrop-blur-sm">
          <BounceDotsLoader className="h-full" />
        </div>
      )}

      <div className="w-[6rem] h-[6rem] mt-2 border border-red rounded-full flex justify-center items-center">
        <icons.trash className="fill-red w-9 h-9" />
      </div>
      <p className="font-bicubik text-xl dark:text-white">{title}</p>
      <p className="text-gray text-lg">{description}</p>

      {more?.map((m, idx) => (
        <div
          key={idx}
          className="border border-gray_lighter rounded-xl w-full dark:border-green_11"
        >
          <span className=" text-gray text-sm">{m?.label}</span>
          <p className="font-semibold text-lg dark:text-white">{m?.description}</p>
        </div>
      ))}

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
    </div>
  );
}

export default DeleteCard;
