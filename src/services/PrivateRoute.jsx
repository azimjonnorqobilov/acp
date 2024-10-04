import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// const checkPermissions = (routePermissions, permissions) => {
//   let count = 0;
//   routePermissions?.map((p) => permissions?.includes(p) && count++);

//   return count === routePermissions?.length;
// };

function PrivateRoute({ children, routePermissions = [], redirectRoute }) {
  const { userInfo } = useSelector((store) => store.auth);

  return userInfo?.id ? children : <Navigate to={redirectRoute} replace />;
}

export default PrivateRoute;
