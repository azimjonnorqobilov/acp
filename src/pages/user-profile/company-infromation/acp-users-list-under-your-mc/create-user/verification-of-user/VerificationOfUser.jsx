import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { icons } from "assets/icons/icons";
import { verifyEmployee } from "store/slices/userSlice";
import BounceDotsLoader from "components/loader/BounceDotsLoader";

function VerificationOfUser({ user, onClose }) {
  const dispatch = useDispatch();

  const { mutate: handleVerifyUser, isLoading } = useMutation(
    "verify-employee",
    () => dispatch(verifyEmployee({ user_id: user?.id, status: true })),
    { onSuccess: () => onClose() }
  );

  return (
    <div className="w-[18rem]  lg:w-full flex flex-col gap-4 items-center text-center">
      <div className="w-[5rem] h-[5rem] mt-2 border border-blue rounded-full flex justify-center items-center">
        <icons.exclamation className="fill-blue w-10" />
      </div>
      <p className="font-bicubik dark:text-white">Verification of user!</p>
      <p className="text-gray w-[85%]">Are you sure to verify this account under your MC?</p>
      <div className="border border-gray_lighter rounded-xl w-full dark:border-green_11">
        <span className="text-xs text-gray">User</span>
        <p className="font-semibold dark:text-white">
          {user?.first_name || ""} {user?.last_name || ""}
        </p>
      </div>
      <div className="w-full flex gap-4">
        <button
          onClick={handleVerifyUser}
          className="w-1/2 bg-blue px-10 py-2 rounded-lg gap-2 text-sm text-white uppercase"
        >
          Yes
        </button>
        <button
          onClick={onClose}
          className="w-1/2 bg-[#F2F5F9] px-10 py-2 rounded-lg gap-2 text-sm text-black uppercase dark:bg-green_11 dark:text-white"
        >
          No
        </button>
      </div>

      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
          <BounceDotsLoader />
        </div>
      )}
    </div>
  );
}

export default VerificationOfUser;
