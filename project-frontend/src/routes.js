import { createBrowserRouter } from "react-router-dom";

import AdminLayout from './layouts/Admin';
import PublicLayout from './layouts/Public';

import PublicHomePage from './views/public/index';
import Collections from './views/public/collections';
import CollectionSettings from './views/public/collection-settings';
import Items from './views/public/items';
import Item from './views/public/item';
import Search from './views/public/search/index';
import UserSettings from './views/public/user-settings';

import Authentication from './views/authentication';
import AdminHomePage from "./views/admin";
import { getLogin } from "./helper/helper";

const user = getLogin();

const publicRoutesArray = [
  {
    element: <PublicLayout user={user} />,
    children: [
      {
        path: "/",
        element: <PublicHomePage user={user} />,
      },
      {
        path: "/collections/",      // list of all collections 
        element: <Collections user={user} />,
      },
      {
        path: "/collections/:id",   // list of all collections by a specific user
        element: <Collections user={user} />,
      },
      {
        path: "/collection/:id",    // details of a collection with list of items
        element: <Items user={user} />,
      },
      {
        path: "/collection/:collectionId/item/:itemId",     // item details
        element: <Item user={user} />,
      },
      {
        path: "/search",
        element: <Search user={user} />,
      },
      {
        path: "/collections/:id/settings",
        element: <CollectionSettings user={user} />,
      },
      {
        path: "/settings",
        element: <UserSettings user={user} />,
      },
    ],
  },
];

const adminRoutesArray = [
  {
    element: <AdminLayout user={user} />,
    children: [
      {
        path: "/",
        element: <PublicHomePage user={user} />,
      },
      {
        path: "/users",
        element: <AdminHomePage user={user} />,
      },
      {
        path: "/collections/",
        element: <Collections user={user} />,
      },
      {
        path: "/collections/:id",   // this is user id
        element: <Collections user={user} />,
      },
      {
        path: "/collection/:id",
        element: <Items user={user} />,
      },
      {
        path: "/collection/:collectionId/item/:itemId",
        element: <Item user={user} />,
      },
      {
        path: "/search",
        element: <Search user={user} />,
      },
      {
        path: "/collections/:id/settings",
        element: <CollectionSettings user={user}/>,
      },
      {
        path: "/settings",
        element: <UserSettings user={user}/>,
      },
    ],
  },
];

const authenticationToutesArray = [
  {
    path: "/authentication",
    element: <Authentication />,
  }
];

// const adminRoutesArray = [
//     {
//         element: <Admin />,
//         children: [
//             {
//                 path: "/dashboard",
//                 element: <Dashboard />,
//                 icon: SpaceDashboard,
//             },
//             {
//                 path: "/",
//                 element: <Navigate replace to="/dashboard" />,
//             },
//             {
//                 path: "/instant-pass",
//                 children: [
//                     {
//                         path: "instant-pass-request-form",
//                         element: <InstantPassRequestForm />,
//                         icon: NoteAlt,
//                     },
//                     {
//                         path: "edit-instant-pass-request/:id",
//                         element: <InstantPassEdit />,
//                         icon: Edit,
//                     },
//                     {
//                         path: "issued-instant-pass-list",
//                         element: <IssuedInstantPassList />,
//                         icon: ListAlt,
//                     },
//                     {
//                         path: "webcam-scanner",
//                         element: <WebCamScanner />,
//                         icon: VideoCameraFront,
//                     },
//                 ],
//             },
//         ],
//     },
// ];

// const notLoggedInRoutesArray = [
//     {
//         path: "instant-pass-request-form",
//         element: <InstantPassRequestForm />,
//         icon: NoteAlt,
//     },
//     {
//         path: "edit-instant-pass-request/:id",
//         element: <InstantPassEdit />,
//         icon: Edit,
//     },
// ];

// do user validation

export const activeRoutesArray = user && user.role === 'admin' ? adminRoutesArray : publicRoutesArray;
export const activeRoutes = createBrowserRouter([...authenticationToutesArray, ...activeRoutesArray]);
