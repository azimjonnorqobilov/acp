import { Outlet } from "react-router-dom";
import AdminSidebar from "layers/sidebar/AdminSidebar";

function AdminPage() {
  return (
    <div className="w-full h-screen flex">
      <div className="w-[20rem] h-full">
        <AdminSidebar />
      </div>
      <div className="w-[calc(100%-20rem)] h-full bg-[#F2F5F9]">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminPage;
