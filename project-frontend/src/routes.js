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

const publicRoutesArray = [
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <PublicHomePage />,
            },
            {
                path: "/collections/",      // list of all collections 
                element: <Collections />,
            },
            {
                path: "/collections/:id",   // list of all collections by a specific user
                element: <Collections />,
            },
            {
                path: "/collection/:id",    // details of a collection with list of items
                element: <Items />,
            },
            {
                path: "/collection/:collectionId/item/:itemId",     // item details
                element: <Item />,
            },
            {
                path: "/search",
                element: <Search />,
            },
            {
                path: "/collections/:id/settings",
                element: <CollectionSettings />,
            },
            {
                path: "/settings",
                element: <UserSettings />,
            },
        ],
    },
];

const adminRoutesArray = [
    {
        element: <AdminLayout />,
        children: [
            {
                path: "/",
                element: <PublicHomePage />,
            },
            {
                path: "/users",
                element: <AdminHomePage />,
            },
            {
                path: "/collections/",
                element: <Collections />,
            },
            {
                path: "/collections/:id",   // this is user id
                element: <Collections />,
            },
            {
                path: "/collection/:id",
                element: <Items />,
            },
            {
                path: "/collection/:collectionId/item/:itemId",
                element: <Item />,
            },
            {
                path: "/search",
                element: <Search />,
            },
            {
                path: "/collections/:id/settings",
                element: <CollectionSettings />,
            },
            {
                path: "/settings",
                element: <UserSettings />,
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

export const activeRoutesArray = adminRoutesArray;
export const activeRoutes = createBrowserRouter([...authenticationToutesArray, ...activeRoutesArray]);
