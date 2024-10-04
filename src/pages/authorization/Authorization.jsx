import { Outlet, useNavigate } from "react-router-dom";
import { icons } from "assets/icons/icons";

function Authorization() {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] overflow-y-auto bg-gray_light bg-sign bg-cover bg-center bg-no-repeat flex items-center justify-center md:flex-col md:items-start">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-4 absolute md:static top-5 left-8 md:top-0 md:left-0 md:px-2 md:pt-2 md:gap-2"
      >
        <div className="bg-blue w-[2rem] h-[2rem] flex items-center justify-center rounded-full p-1">
          <icons.arrow className="w-[0.4rem] fill-white" />
        </div>
        <span className="text-lg">Back Home</span>
      </button>
      <div className="md:h-[calc(100%-40px)] md:flex md:items-center md:justify-center md:w-full md:p-2">
        <Outlet />
      </div>
    </div>
  );
}

export default Authorization;
