import dayjs from "dayjs";
import { Outlet } from "react-router-dom";
import { icons } from "assets/icons/icons";

// system page

import SystemPage from "layouts/system-page/SystemPage";
import FindLoads from "pages/find-loads/FindLoads";
import PostLoads from "pages/post-loads/PostLoads";
import FindTrucks from "pages/find-trucks/FindTrucks";
import PostTrucks from "pages/post-trucks/PostTrucks";
import FindShippersLoads from "pages/find-shippers-loads/FindShippersLoads";
import PostShippersLoads from "pages/post-shippers-loads/PostShippersLoads";
import AvailableLoadsOrTrucks from "pages/available-loads-or-trucks/AvailableLoadsOrTrucks";

// users profile

import UserProfile from "pages/user-profile/UserProfile";
import Profile from "pages/user-profile/profile/Profile";
import CompanyInformation from "pages/user-profile/company-infromation/CompanyInformation";
import CommentAndReview from "pages/user-profile/comment-and-review/CommentAndReview";
import PostedLoads from "pages/user-profile/posted-loads/PostedLoads";
import Help from "pages/user-profile/help/Help";
import UserMenu from "pages/user-profile/user-menu/UserMenu";

// users profile

// system page

// admin page

// import Dashboard from "pages/admin/dashboard/Dashboard";

// accunts directory

// import AccuntsDirectory from "pages/admin/accounts-directory/AccuntsDirectory";
// import CarrierDispatchers from "pages/admin/accounts-directory/carrier-dispatchers/CarrierDispatchers";
// import Carriers from "pages/admin/accounts-directory/carriers/Carriers";
// import Brokers from "pages/admin/accounts-directory/brokers/Brokers";
// import Shippers from "pages/admin/accounts-directory/shippers/Shippers";

// accunts directory

// import LoadPosting from "pages/admin/load-posting/LoadPosting";
// import SiteSettings from "pages/admin/site-settings/SiteSettings";
// import SupportCenter from "pages/admin/support-center/SupportCenter";
// import AdminPage from "layouts/admin-page/AdminPage";
// import ChangeOfMedia from "pages/admin/site-settings/change-of-media/ChangeOfMedia";
// import ChangeOfTerms from "pages/admin/site-settings/change-of-terms/ChangeOfTerms";
// import TypesAndContexts from "pages/admin/site-settings/types-and-contexts/TypesAndContexts";

// admin page

export const AUTHORITY_TYPES = {
  carrier: [
    { label: "No MC / USDOT", value: "" },
    { label: "MC", value: "MC_MX" },
    { label: "USDOT", value: "USDOT" },
  ],
  broker: [
    { label: "MC", value: "MC_MX" },
    { label: "USDOT", value: "USDOT" },
  ],
  shipper: [{ label: "Shipper", value: "" }],
};

export const ROLES_ROUTES = {
  mobile: {
    "carrier-dispatcher": [
      {
        id: 1,
        key: "carrier-dispatcher",
        route: "carrier-dispatcher",
        element: <Outlet />,
        noCollapses: false,
        collapses: [
          {
            id: 1,
            key: "find-loads",
            route: "",
            label: "Find Loads",
            element: <FindLoads />,
            noCollapses: true,
          },
          {
            id: 2,
            key: "available-loads",
            route: "available-loads",
            label: "Available Loads",
            element: <Outlet />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "loads",
                route: "",
                label: "Loads",
                element: <AvailableLoadsOrTrucks />,
                noCollapses: true,
              },
              {
                id: 2,
                key: "loads-items",
                route: ":id",
                label: "Loads Items",
                element: <AvailableLoadsOrTrucks />,
                noCollapses: true,
              },
            ],
          },
          {
            id: 2,
            key: "user-profile",
            route: "",
            element: <UserProfile />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "profile",
                route: "profile",
                label: "Profile",
                element: <Profile />,
                noCollapses: true,
              },
              {
                id: 2,
                key: "comment-and-review",
                route: "comment-and-review",
                label: "Comment And Review",
                element: <CommentAndReview />,
                noCollapses: true,
              },
              {
                id: 3,
                key: "help",
                route: "help",
                label: "Help",
                element: <Help />,
                noCollapses: true,
              },
              {
                id: 4,
                key: "menu",
                route: "user",
                label: "User",
                element: <UserMenu />,
                noCollapses: true,
              },
            ],
          },
        ],
      },
    ],

    carrier: [
      {
        id: 1,
        key: "carrier",
        route: "carrier",
        label: "Carrier",
        element: <Outlet />,
        noCollapses: false,
        collapses: [
          {
            id: 1,
            key: "find-loads",
            route: "",
            label: "Find Loads",
            element: <Outlet />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "find-loads",
                route: "",
                label: "Find Loads",
                element: <FindLoads />,
                noCollapses: true,
              },
              {
                id: 2,
                key: "available-loads",
                route: "available-loads",
                label: "Available Loads",
                element: <Outlet />,
                noCollapses: false,
                collapses: [
                  {
                    id: 1,
                    key: "loads",
                    route: "",
                    label: "Loads",
                    element: <AvailableLoadsOrTrucks />,
                    noCollapses: true,
                  },
                  {
                    id: 2,
                    key: "loads-items",
                    route: ":id",
                    label: "Loads Items",
                    element: <AvailableLoadsOrTrucks />,
                    noCollapses: true,
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            key: "post-trucks",
            route: "post-trucks",
            label: "Post Trucks",
            element: <Outlet />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "post-trucks",
                route: "",
                label: "Post Trucks",
                element: <PostTrucks />,
                noCollapses: false,
              },
              {
                id: 2,
                route: "available-loads",
                label: "Available Loads",
                element: <Outlet />,
                noCollapses: false,
                collapses: [
                  {
                    id: 1,
                    route: "",
                    label: "Loads",
                    element: <AvailableLoadsOrTrucks />,
                    noCollapses: false,
                  },
                  {
                    id: 2,
                    route: ":id",
                    label: "Load Items",
                    element: <AvailableLoadsOrTrucks />,
                    noCollapses: false,
                  },
                ],
              },
            ],
          },
          {
            id: 3,
            key: "user-profile",
            route: "",
            label: "User Profile",
            element: <UserProfile />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "profile",
                route: "profile",
                label: "Profile",
                element: <Profile />,
                noCollapses: true,
              },
              {
                id: 2,
                key: "company-information",
                route: "company-information",
                label: "Company Information",
                element: <CompanyInformation />,
                noCollapses: true,
              },
              {
                id: 3,
                key: "comment-and-review",
                route: "comment-and-review",
                label: "Comment And Review",
                element: <CommentAndReview />,
                noCollapses: true,
              },
              {
                id: 4,
                key: "posted-loads",
                route: "posted-trucks",
                label: "Posted Trucks",
                element: <PostedLoads />,
                noCollapses: true,
              },
              {
                id: 5,
                key: "help",
                route: "help",
                label: "Help",
                element: <Help />,
                noCollapses: true,
              },
              {
                id: 6,
                key: "user",
                route: "user",
                label: "User",
                element: <UserMenu />,
                noCollapses: true,
              },
            ],
          },
        ],
      },
    ],

    broker: [
      {
        id: 1,
        key: "broker",
        route: "broker",
        element: <Outlet />,
        noCollapses: false,
        collapses: [
          {
            id: 1,
            key: "post-loads",
            route: "",
            label: "Post Loads",
            element: <Outlet />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "post-loads",
                route: "",
                label: "Post Loads",
                element: <PostLoads />,
                noCollapses: false,
              },
              {
                id: 2,
                key: "available-trucks",
                route: "available-trucks",
                label: "Availabale-trucks",
                element: <Outlet />,
                noCollapses: false,
                collapses: [
                  {
                    id: 1,
                    key: "trucks",
                    route: "",
                    label: "Trucks",
                    element: <AvailableLoadsOrTrucks />,
                    noCollapses: false,
                  },
                  {
                    id: 2,
                    key: "trucks-items",
                    route: ":id",
                    label: "Trucks Items",
                    element: <AvailableLoadsOrTrucks />,
                    noCollapses: false,
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            key: "find-trucks",
            route: "find-trucks",
            label: "Find Trucks",
            element: <Outlet />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "find-trucks",
                route: "",
                label: "Find Trucks",
                element: <FindTrucks />,
                noCollapses: true,
              },
              {
                id: 2,
                key: "available-trucks",
                route: "available-trucks",
                label: "Available Trucks",
                element: <Outlet />,
                noCollapses: false,
                collapses: [
                  {
                    id: 2,
                    key: "trucks",
                    route: "",
                    label: "Trucks",
                    element: <AvailableLoadsOrTrucks />,
                    noCollapses: true,
                  },
                  {
                    id: 2,
                    key: "trucks-items",
                    route: ":id",
                    label: "Trucks Items",
                    element: <AvailableLoadsOrTrucks />,
                    noCollapses: true,
                  },
                ],
              },
            ],
          },
          {
            id: 3,
            key: "shippers-loads",
            route: "shippers-loads",
            label: "Shippers Loads",
            element: <Outlet />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "shippers-loads",
                route: "",
                label: "Shippers Loads",
                element: <FindShippersLoads />,
                noCollapses: true,
              },
              {
                id: 2,
                key: "available-loads",
                route: "available-loads",
                label: "Available Loads",
                element: <Outlet />,
                noCollapses: false,
                collapses: [
                  {
                    id: 1,
                    key: "loads",
                    route: "",
                    label: "Loads",
                    element: <AvailableLoadsOrTrucks />,
                    noCollapses: true,
                  },
                  {
                    id: 2,
                    key: "loads-items",
                    route: ":id",
                    label: "Loads Items",
                    element: <AvailableLoadsOrTrucks />,
                    noCollapses: true,
                  },
                ],
              },
            ],
          },

          {
            id: 4,
            key: "user-profile",
            route: "",
            label: "User Profile",
            element: <UserProfile />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "profile",
                route: "profile",
                label: "Profile",
                element: <Profile />,
                noCollapses: true,
              },
              {
                id: 2,
                key: "company-information",
                route: "company-information",
                label: "Company Information",
                element: <CompanyInformation />,
                noCollapses: true,
              },
              {
                id: 3,
                key: "comment-and-review",
                route: "comment-and-review",
                label: "Comment And Review",
                element: <CommentAndReview />,
                noCollapses: true,
              },
              {
                id: 4,
                key: "posted-loads",
                route: "posted-loads",
                label: "Posted Loads",
                element: <PostedLoads />,
                noCollapses: true,
              },
              {
                id: 5,
                key: "help",
                route: "help",
                label: "Help",
                element: <Help />,
                noCollapses: true,
              },
              {
                id: 6,
                key: "user",
                route: "user",
                label: "User",
                element: <UserMenu />,
                noCollapses: true,
              },
            ],
          },
        ],
      },
    ],

    shipper: [
      {
        id: 1,
        key: "shipper",
        route: "shipper",
        label: "Shipper Portal",
        element: <Outlet />,
        noCollapses: false,
        collapses: [
          {
            id: 1,
            key: "shipper",
            route: "",
            label: "Shipper",
            element: <PostShippersLoads />,
            noCollapses: true,
          },
          {
            id: 2,
            key: "available-trucks",
            route: "available-trucks",
            label: "Availabale-trucks",
            element: <Outlet />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "trucks",
                route: "",
                label: "Trucks",
                element: <AvailableLoadsOrTrucks />,
                noCollapses: false,
              },
              {
                id: 2,
                key: "trucks-items",
                route: ":id",
                label: "Trucks Items",
                element: <AvailableLoadsOrTrucks />,
                noCollapses: false,
              },
            ],
          },
          {
            id: 3,
            key: "user-profile",
            route: "",
            label: "User Profile",
            element: <UserProfile />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "profile",
                route: "profile",
                label: "Profile",
                element: <Profile />,
                noCollapses: true,
              },
              {
                id: 2,
                key: "comment-and-review",
                route: "comment-and-review",
                label: "Comment And Review",
                element: <CommentAndReview />,
                noCollapses: true,
              },
              {
                id: 3,
                key: "posted-loads",
                route: "posted-loads",
                label: "Posted Loads",
                element: <PostedLoads />,
                noCollapses: true,
              },
              {
                id: 4,
                key: "help",
                route: "help",
                label: "Help",
                element: <Help />,
                noCollapses: true,
              },
              {
                id: 5,
                key: "user",
                route: "user",
                label: "User",
                element: <UserMenu />,
                noCollapses: true,
              },
            ],
          },
        ],
      },
    ],
  },
  desktop: {
    "carrier-dispatcher": [
      {
        id: 1,
        key: "carrier-dispatcher",
        route: "carrier-dispatcher",
        element: <Outlet />,
        noCollapses: false,
        collapses: [
          {
            id: 1,
            key: "find-loads",
            route: "",
            label: "Find Loads",
            element: <FindLoads />,
            noCollapses: true,
          },
          {
            id: 2,
            key: "user-profile",
            route: "",
            element: <UserProfile />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "profile",
                route: "profile",
                label: "Profile",
                element: <Profile />,
                noCollapses: true,
              },
              {
                id: 2,
                key: "comment-and-review",
                route: "comment-and-review",
                label: "Comment And Review",
                element: <CommentAndReview />,
                noCollapses: true,
              },
              {
                id: 3,
                key: "help",
                route: "help",
                label: "Help",
                element: <Help />,
                noCollapses: true,
              },
            ],
          },
        ],
      },
    ],

    carrier: [
      {
        id: 1,
        key: "carrier",
        route: "carrier",
        label: "Carrier",
        element: <Outlet />,
        noCollapses: false,
        collapses: [
          {
            id: 1,
            key: "find-loads",
            route: "",
            label: "Find Loads",
            element: <FindLoads />,
            noCollapses: true,
          },
          {
            id: 2,
            key: "post-trucks",
            route: "post-trucks",
            label: "Post Trucks",
            element: <PostTrucks />,
            noCollapses: true,
          },
          {
            id: 3,
            key: "user-profile",
            route: "",
            label: "User Profile",
            element: <UserProfile />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "profile",
                route: "profile",
                label: "Profile",
                element: <Profile />,
                noCollapses: true,
              },
              {
                id: 2,
                key: "company-information",
                route: "company-information",
                label: "Company Information",
                element: <CompanyInformation />,
                noCollapses: true,
              },
              {
                id: 3,
                key: "comment-and-review",
                route: "comment-and-review",
                label: "Comment And Review",
                element: <CommentAndReview />,
                noCollapses: true,
              },
              {
                id: 4,
                key: "posted-loads",
                route: "posted-trucks",
                label: "Posted Trucks",
                element: <PostedLoads />,
                noCollapses: true,
              },
              {
                id: 5,
                key: "help",
                route: "help",
                label: "Help",
                element: <Help />,
                noCollapses: true,
              },
            ],
          },
        ],
      },
    ],

    broker: [
      {
        id: 1,
        key: "broker",
        route: "broker",
        element: <Outlet />,
        noCollapses: false,
        collapses: [
          {
            id: 1,
            key: "post-loads",
            route: "",
            label: "Post Loads",
            element: <PostLoads />,
            noCollapses: true,
          },
          {
            id: 2,
            key: "find-trucks",
            route: "find-trucks",
            label: "Find Trucks",
            element: <FindTrucks />,
            noCollapses: true,
          },
          {
            id: 3,
            key: "shippers-loads",
            route: "shippers-loads",
            label: "Shippers Loads",
            element: <FindShippersLoads />,
            noCollapses: true,
          },

          {
            id: 4,
            key: "user-profile",
            route: "",
            label: "User Profile",
            element: <UserProfile />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "profile",
                route: "profile",
                label: "Profile",
                element: <Profile />,
                noCollapses: true,
              },
              {
                id: 2,
                key: "company-information",
                route: "company-information",
                label: "Company Information",
                element: <CompanyInformation />,
                noCollapses: true,
              },
              {
                id: 3,
                key: "comment-and-review",
                route: "comment-and-review",
                label: "Comment And Review",
                element: <CommentAndReview />,
                noCollapses: true,
              },
              {
                id: 4,
                key: "posted-loads",
                route: "posted-loads",
                label: "Posted Loads",
                element: <PostedLoads />,
                noCollapses: true,
              },
              {
                id: 5,
                key: "help",
                route: "help",
                label: "Help",
                element: <Help />,
                noCollapses: true,
              },
            ],
          },
        ],
      },
    ],

    shipper: [
      {
        id: 1,
        key: "shipper",
        route: "shipper",
        label: "Shipper Portal",
        element: <Outlet />,
        noCollapses: false,
        collapses: [
          {
            id: 1,
            key: "shipper",
            route: "",
            label: "Shipper",
            element: <PostShippersLoads />,
            noCollapses: true,
          },
          {
            id: 3,
            key: "user-profile",
            route: "",
            label: "User Profile",
            element: <UserProfile />,
            noCollapses: false,
            collapses: [
              {
                id: 1,
                key: "profile",
                route: "profile",
                label: "Profile",
                element: <Profile />,
                noCollapses: true,
              },
              {
                id: 2,
                key: "comment-and-review",
                route: "comment-and-review",
                label: "Comment And Review",
                element: <CommentAndReview />,
                noCollapses: true,
              },
              {
                id: 3,
                key: "posted-loads",
                route: "posted-loads",
                label: "Posted Loads",
                element: <PostedLoads />,
                noCollapses: true,
              },
              {
                id: 4,
                key: "help",
                route: "help",
                label: "Help",
                element: <Help />,
                noCollapses: true,
              },
            ],
          },
        ],
      },
    ],
  },
};

export const ROUTES = (role, deviceType = "mobile") => [
  {
    id: 1,
    key: "system-page",
    label: "System Page",
    route: "",
    element: <SystemPage />,
    noCollapses: false,
    collapses: ROLES_ROUTES?.[deviceType]?.[role],
  },
];

// export const ACCOUNTS_DIRECTORY_ROUTES = [
//   {
//     id: 1,
//     key: "carrier-dispatchers",
//     icon: icons.info,
//     label: "Carrier Dispatchers",
//     route: "",
//     element: <CarrierDispatchers />,
//     visible: true,
//     noCollapses: true,
//   },
//   {
//     id: 2,
//     key: "carriers",
//     icon: icons.info,
//     label: "Carriers",
//     route: "carriers",
//     element: <Carriers />,
//     visible: true,
//     noCollapses: true,
//   },
//   {
//     id: 3,
//     key: "brokers",
//     icon: icons.info,
//     label: "Brokers",
//     route: "brokers",
//     element: <Carriers />,
//     visible: true,
//     noCollapses: true,
//   },
//   {
//     id: 4,
//     key: "shippers",
//     icon: icons.info,
//     label: "Shippers",
//     route: "shippers",
//     element: <Shippers />,
//     visible: true,
//     noCollapses: true,
//   },
// ];

// export const SITE_SETTINGS_ROUTES = [
//   {
//     id: 1,
//     key: "change-of-media",
//     icon: icons.info,
//     label: "Change Of Media",
//     route: "",
//     element: <ChangeOfMedia />,
//     visible: true,
//     noCollapses: true,
//   },
//   {
//     id: 2,
//     key: "change-of-terms",
//     icon: icons.info,
//     label: "Change Of Terms",
//     route: "change-of-terms",
//     element: <ChangeOfTerms />,
//     visible: true,
//     noCollapses: true,
//   },
//   {
//     id: 3,
//     key: "types-and-contexts",
//     icon: icons.info,
//     label: "Types And Contexts",
//     route: "types-and-contexts",
//     element: <TypesAndContexts />,
//     visible: true,
//     noCollapses: true,
//   },
// ];

// export const ADMIN_ROUTES = [
//   {
//     id: 1,
//     key: "admin",
//     route: "admin",
//     element: <AdminPage />,
//     noCollapses: false,
//     collapses: [
//       {
//         id: 1,
//         key: "dashboard",
//         icon: icons.dashboard,
//         label: "Dashboard",
//         route: "",
//         element: <Dashboard />,
//         visible: true,
//         noCollapses: true,
//       },
//       {
//         id: 2,
//         key: "accounts-directory",
//         icon: icons.info,
//         label: "Accounts Directory",
//         route: "accounts-directory",
//         element: <AccuntsDirectory />,
//         visible: true,
//         noCollapses: false,
//         collapses: ACCOUNTS_DIRECTORY_ROUTES,
//       },
//       {
//         id: 3,
//         key: "load-posting",
//         icon: icons.table,
//         label: "Load Posting",
//         route: "load-posting",
//         element: <LoadPosting />,
//         visible: true,
//         noCollapses: true,
//       },
//       {
//         id: 4,
//         key: "site-settings",
//         icon: icons.setting,
//         label: "Site Settings",
//         route: "site-settings",
//         element: <SiteSettings />,
//         visible: true,
//         noCollapses: false,
//         collapses: SITE_SETTINGS_ROUTES,
//       },
//       {
//         id: 5,
//         key: "support-center",
//         icon: icons.support,
//         label: "Support Center",
//         route: "support-center",
//         element: <SupportCenter />,
//         visible: true,
//         noCollapses: true,
//       },
//     ],
//   },
// ];

export const REFACTOR_DATE = (date) => {
  const newDate = (date) => `${date?.split("-")?.[1]}/${date?.split("-")?.[2]}`;

  if (typeof date === "string") {
    return newDate(date);
  } else {
    const [startDate, endDate] = date;

    return startDate && endDate
      ? `${newDate(startDate)} - ${newDate(endDate)}`
      : startDate
      ? newDate(startDate)
      : "-";
  }
};

export const REFACTOR_SUM = (sum, divisor = ",") => {
  if (sum?.toString()?.includes(".")) {
    const first = sum?.toString()?.split(".")?.[0];
    const second = sum?.toString()?.split(".")?.[1];

    return `${
      first?.length > 3
        ? first
            ?.split("")
            ?.reverse()
            ?.map((s, idx) => ((idx + 1) % 3 === 0 ? `${divisor}${s}` : s))
            ?.reverse()
            ?.join("")
            ?.trimStart()
        : first
    }.${
      second?.length > 3
        ? second
            ?.split("")
            ?.map((s, idx) => ((idx + 1) % 3 === 0 ? `${s}${divisor}` : s))
            ?.join("")
            ?.trimStart()
        : second
    }`;
  } else
    return sum?.toString()?.length > 3
      ? sum
          ?.toString()
          ?.split("")
          ?.reverse()
          ?.map((s, idx) => ((idx + 1) % 3 === 0 ? `${divisor}${s}` : s))
          ?.reverse()
          ?.join("")
          ?.trimStart()
      : sum;
};

export const PERMISSION_CHECK = (roles, entity_type, type = "every") => {
  return type === "every"
    ? roles?.every((role) => role === entity_type)
    : roles?.some((role) => role === entity_type);
};

export const SORT_DATA = (array, field, sort = true) => {
  const sortedArray = [...array];

  switch (field) {
    case "company_name": {
      return sortedArray?.sort((a, b) => {
        if (a?.company?.name > b?.company?.name) return sort ? 1 : -1;
        if (a?.company?.name < b?.company?.name) return sort ? -1 : 1;
        return 0;
      });
    }

    case "type": {
      return sortedArray?.sort((a, b) => {
        const typeA = a?.[field]?.id
          ? a?.[field]?.ext
          : TYPES_TO_STRING({
              types: a?.type,
              categories: a?.type_category,
              joinCount: 2,
              onlyString: true,
            });

        const typeB = b?.[field]?.id
          ? b?.[field]?.ext
          : TYPES_TO_STRING({
              types: b?.type,
              categories: b?.type_category,
              joinCount: 2,
              onlyString: true,
            });

        if (typeA > typeB) return sort ? 1 : -1;
        if (typeA < typeB) return sort ? -1 : 1;
        return 0;
      });
    }

    default: {
      return sortedArray?.sort((a, b) => {
        if (a?.[field] > b?.[field]) return sort ? 1 : -1;
        if (a?.[field] < b?.[field]) return sort ? -1 : 1;
        return 0;
      });
    }
  }

  // return sortedArray;
};

export const TOPICS = [
  { id: 1, label: "Upgrade your status", value: "upgrade_your_status" },
  { id: 2, label: "Change personal information", value: "contact_us" },
  { id: 3, label: "Company information change", value: "company_information_change" },
  {
    id: 4,
    label: "Suspicious users found under your MC",
    value: "suspicious_users_found_under_your_mc",
  },
  {
    id: 5,
    label: "Sign-in activity on unknown device/browser",
    value: "sign_in_activity_on_unknown_device_or_browser",
  },
  {
    id: 6,
    label: "Registration issue",
    value: "registration_issue",
  },
  {
    id: 7,
    label: "Comment and rating issues",
    value: "comment_and_rating_issues",
  },
  {
    id: 8,
    label: "Technical issues with ACP",
    value: "technical_issues_with_acp",
  },
  {
    id: 9,
    label: "Bugs and errors with ACP",
    value: "bugs_and_errors_with_acp",
  },
  {
    id: 10,
    label: "Feedback and suggestions",
    value: "feedback_and_suggestions",
  },
];

export const RENDER_TIME_NOW = () => {
  const date = new Date();
  const hours = date?.getHours();
  const minutes = date?.getMinutes();
  const seconds = date?.getSeconds();
  const time = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
  return time;
};

export const CHECK_PICKUP_DATE = ([startDate, endDate]) => {
  const today = new Date();
  const [startDateParsed, endDateParsed] = [
    startDate && {
      day: parseInt(startDate?.split("-")?.[2], 10),
      year: parseInt(startDate?.split("-")?.[0], 10),
      month: parseInt(startDate?.split("-")?.[1], 10),
    },
    endDate && {
      day: parseInt(endDate?.split("-")?.[2], 10),
      year: parseInt(endDate?.split("-")?.[0], 10),
      month: parseInt(endDate?.split("-")?.[1], 10),
    },
  ];
  const [startDateChecked, endDateChecked] = [
    startDateParsed?.year > today?.getFullYear()
      ? true
      : startDateParsed?.year === today?.getFullYear()
      ? startDateParsed?.month > today?.getMonth() + 1
        ? true
        : startDateParsed?.month === today?.getMonth() + 1
        ? startDateParsed?.day > today?.getDate()
          ? true
          : startDateParsed?.day === today?.getDate()
          ? true
          : false
        : false
      : false,
    endDateParsed?.year > today?.getFullYear()
      ? true
      : endDateParsed?.year === today?.getFullYear()
      ? endDateParsed?.month > today?.getMonth() + 1
        ? true
        : endDateParsed?.month === today?.getMonth() + 1
        ? endDateParsed?.day > today?.getDate()
          ? true
          : endDateParsed?.day === today?.getDate()
          ? true
          : false
        : false
      : false,
  ];

  return endDate
    ? endDateChecked
      ? [startDateChecked ? startDate : dayjs(today).format("YYYY-MM-DD"), endDate]
      : [dayjs(today).format("YYYY-MM-DD")]
    : [startDateChecked ? startDate : dayjs(today).format("YYYY-MM-DD")];
};

export const TYPES_TO_STRING = ({ types, categories, joinCount, onlyString = false }) => {
  const categoriesJoin = categories?.length
    ? categories?.reduce(
        (text, c, idx) => (text += idx < joinCount ? `${idx !== 0 ? "/" : ""}${c?.ext}` : ""),
        ""
      )
    : "";

  const typesJoin =
    types?.length && categories?.length < joinCount
      ? types?.reduce(
          (text, t, idx) =>
            (text +=
              idx < joinCount - categories?.length
                ? `${idx !== 0 || categories?.length ? "/" : ""}${t?.ext}`
                : ""),
          ""
        )
      : "";

  return onlyString ? (
    `${categoriesJoin}${typesJoin}${categories?.length + types?.length > joinCount ? "/..." : ""}`
  ) : (
    <span>
      <span className="font-bold">{categoriesJoin}</span>
      <span>{typesJoin}</span>
      {categories?.length + types?.length > joinCount ? "/..." : ""}
    </span>
  );
};

export const parseSearchParams = (param, type = "json") => {
  let paramJson = {};
  const paramSplit = param?.replace("?", "")?.split("&");

  const paramArray = paramSplit?.map((item) => {
    const [key, value] = item?.split("=");
    paramJson = { ...paramJson, [key]: value };
    return { [key]: value };
  });

  return type === "json" ? paramJson : paramArray;
};
