import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { icons } from "assets/icons/icons";
import { verifyAccount } from "store/slices/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import BounceDotsLoader from "components/loader/BounceDotsLoader";

function Verification() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, data } = useQuery(
    ["verify-account", params?.key],
    () => dispatch(verifyAccount(params?.key)),
    {
      refetchOnWindowFocus: false,
    }
  );

  return isLoading ? (
    <BounceDotsLoader />
  ) : data?.payload?.status === 200 ? (
    <div className="w-[25rem] bg-white rounded-3xl p-14 flex flex-col items-center justify-center text-center gap-4 md:w-full md:border md:border-[#D1DAE6]">
      <div className="border border-blue w-[8rem] xl:w-[6rem] h-[8rem] xl:h-[6rem] flex justify-center items-center rounded-full">
        <icons.doubleCheck className="fill-blue w-[5rem] xl:w-[3rem]" />
      </div>
      <p className="text-2xl uppercase font-bicubik flex items-center text-blue">
        Successfully verified!
      </p>
      <button
        onClick={() => navigate("/sign-in")}
        className="bg-blue flex items-center justify-center gap-2 text-white px-8 py-2 rounded-lg w-full"
      >
        <icons.login /> <span className="text-lg">LOGIN</span>
      </button>
    </div>
  ) : (
    <div className="w-[25rem] bg-white rounded-3xl p-14 flex flex-col items-center justify-center text-center gap-4 md:w-full md:border md:border-[#D1DAE6]">
      <div className="border border-red w-[8rem] xl:w-[6rem] h-[8rem] xl:h-[6rem] flex justify-center items-center rounded-full">
        <icons.warning className="fill-red w-[5rem] h-[5rem] xl:w-[3rem] xl:h-[3rem]" />
      </div>
      <p className="text-2xl uppercase font-bicubik flex items-center text-red">NOT VERIFIED</p>
    </div>
  );
}

export default Verification;
