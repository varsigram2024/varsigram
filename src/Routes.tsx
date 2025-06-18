import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import ProfilepageOrganizationPage from "./pages/Profilepage";
import Homepage from "./pages/Homepage";

const ProjectRoutes = () => {
    let element = useRoutes([
        { path: "/", element: <Navigate to="/home" /> },
        { path: "/user-profile", element: <ProfilepageOrganizationPage /> },
        { path: "/home", element: <Homepage /> }
    ])

    return element
};

export default ProjectRoutes;