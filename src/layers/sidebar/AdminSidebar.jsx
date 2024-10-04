import { useState } from "react";
import { icons } from "assets/icons/icons";
import { ADMIN_ROUTES } from "assets/constants/constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MUIModal from "components/mui-modal/MUIModal";
import Logout from "layers/logout/Logout";

import LOGO from "assets/images/logo-light.svg";

function AdminSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openModal, setOpenModal] = useState({ open: false, action: "" });

  const ROUTES = ADMIN_ROUTES?.[0]?.collapses;
  const currentPath = pathname?.split("/");

  const handleOpenModal = (action) => setOpenModal({ open: true, action });
  const handleCloseModal = () => setOpenModal({ ...openModal, open: false });

  return (
    <>
      <MUIModal open={openModal?.open}>
        <Logout onLogout={() => navigate("/")} onClose={handleCloseModal} />
      </MUIModal>
      <div className="w-full h-full flex flex-col justify-between bg-[#1C303E] pt-7">
        <div>
          <Link to="/admin">
            <img src={LOGO} alt="logo" className="w-[10rem] mx-auto" />
          </Link>

          <div className="flex flex-col pt-8 px-6">
            {ROUTES?.map((route) => (
              <Link
                key={route?.id}
                to={`/admin/${route?.route}`}
                className={`flex items-center gap-2 py-2 border-b border-[#ffffff10]  hover:text-blue_1 [&>*:nth-child(1)]:hover:fill-blue_1 ${
                  currentPath?.[2] === route?.route ||
                  ((currentPath?.[2] === undefined || !currentPath?.[2]) &&
                    route?.key === "dashboard")
                    ? "[&>*:nth-child(1)]:fill-blue text-blue"
                    : "[&>*:nth-child(1)]:fill-white text-white"
                }`}
              >
                <route.icon className="" /> <span>{route?.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="px-6 pb-4">
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-4 text-white hover:text-red [&>*:nth-child(1)]:hover:fill-red"
          >
            <icons.logout className="fill-white" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
