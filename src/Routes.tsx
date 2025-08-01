import React from "react";
import { useRoutes, Navigate, Link } from "react-router-dom";
import ProfilepageOrganizationPage from "./pages/Profilepage";
import Homepage from "./pages/Homepage";
import NotificationsPage from './pages/Notifications/index.tsx';

const ProjectRoutes = () => {
    let element = useRoutes([
        { path: "/", element: <Navigate to="/home" /> },
        { path: "/user-profile", element: <ProfilepageOrganizationPage /> },
        { path: "/home", element: <Homepage /> },
        {
          path: "/notifications",
          element: <NotificationsPage />
        },
    ])

    return element
};

export default ProjectRoutes;