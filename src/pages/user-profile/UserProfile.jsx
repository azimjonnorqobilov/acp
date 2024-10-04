import { Outlet } from "react-router-dom";
import UserSidebar from "layers/sidebar/UserSidebar";

function UserProfile() {
  return (
    <div className="flex h-full gap-4 p-4 lg:p-2">
      <div className="w-[17rem] h-full lg:hidden">
        <UserSidebar />
      </div>
      <div className="w-[calc(100%-17rem)] h-full lg:w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default UserProfile;
