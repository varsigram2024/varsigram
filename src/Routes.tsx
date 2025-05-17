import React from "react";
import { useRoutes } from "react-router-dom";
import ProfilepageOrganizationPage from "./pages/ProfilepageOrganization";

const ProjectRoutes = () => {
    let element = useRoutes([
        { path: "/user-profile", element: <ProfilepageOrganizationPage /> }
    ])

    return element
};

export default ProjectRoutes;