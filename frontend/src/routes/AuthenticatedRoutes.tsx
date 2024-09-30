import { Route, Routes } from "react-router-dom";

import Navbar from "../components/AuthenticatedNavbar";
import QuestionPage from "../pages/services/QuestionPage";
import NotFoundPage from "../pages/miscellaneous/NotFoundPage";

// TODO: Add collaboration and matching pages here
export const AuthenticatedRoutes = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<QuestionPage />} />
                <Route path="/questions" element={<QuestionPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
};

export default AuthenticatedRoutes;